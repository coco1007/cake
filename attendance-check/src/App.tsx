import { useState, useEffect } from 'react'
import { Container, Typography, Box, Paper, Button, List, ListItem, ListItemText, Dialog, DialogTitle, DialogContent, DialogActions, Chip } from '@mui/material'
import { format, differenceInMinutes } from 'date-fns'
import { ko } from 'date-fns/locale'
import { BrowserRouter as Router } from 'react-router-dom'
import Navbar from './components/Navbar'
import StudentManagement from './components/StudentManagement'

interface Attendance {
  id: number
  date: Date
  name: string
  status: 'pending' | 'confirmed' | 'late' | 'absent'
  firstClickTime?: Date
}

interface Student {
  id: number
  name: string
}

function App() {
  const [attendances, setAttendances] = useState<Attendance[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [pendingAttendance, setPendingAttendance] = useState<{ name: string; firstClickTime: Date } | null>(null)
  const [isStudentManagementOpen, setIsStudentManagementOpen] = useState(false)
  const [showLateDialog, setShowLateDialog] = useState(false)
  const [lateStudent, setLateStudent] = useState<{ name: string; firstClickTime: Date } | null>(null)

  // 1시간 20분 지난 출석 체크 확인
  useEffect(() => {
    const checkLateAttendance = () => {
      const now = new Date()
      const lateTime = 80 // 1시간 20분
      attendances.forEach((attendance) => {
        if (
          attendance.status === 'pending' &&
          attendance.firstClickTime &&
          differenceInMinutes(now, attendance.firstClickTime) >= lateTime
        ) {
          setLateStudent({
            name: attendance.name,
            firstClickTime: attendance.firstClickTime
          })
          setShowLateDialog(true)
        }
      })
    }
    const interval = setInterval(checkLateAttendance, 60000)
    return () => clearInterval(interval)
  }, [attendances])

  // 학생 추가 함수 (학생관리에서 사용)
  const handleAddStudent = (studentName: string) => {
    if (!studentName.trim()) return
    if (students.some((s) => s.name === studentName.trim())) return
    setStudents([...students, { id: Date.now(), name: studentName.trim() }])
  }

  // 출석 첫 클릭
  const handleFirstClick = (studentName: string) => {
    setPendingAttendance({
      name: studentName,
      firstClickTime: new Date()
    })
    setAttendances([
      ...attendances,
      {
        id: Date.now(),
        date: new Date(),
        name: studentName,
        status: 'pending',
        firstClickTime: new Date()
      }
    ])
  }

  // 출석 두 번째 클릭
  const handleSecondClick = (studentName: string) => {
    if (!pendingAttendance || pendingAttendance.name !== studentName) return
    const now = new Date()
    const timeDiff = differenceInMinutes(now, pendingAttendance.firstClickTime)
    if (timeDiff < 10) {
      alert('10분 이내에 다시 클릭할 수 없습니다.')
      // 미인정 처리
      setAttendances((prev) =>
        prev.map((a) =>
          a.name === studentName && a.status === 'pending'
            ? { ...a, status: 'absent' as const }
            : a
        )
      )
      setPendingAttendance(null)
      return
    }
    setAttendances((prev) =>
      prev.map((a) =>
        a.name === studentName && a.status === 'pending'
          ? { ...a, status: 'confirmed' as const, date: now }
          : a
      )
    )
    setPendingAttendance(null)
  }

  // 출석 버튼 클릭 핸들러
  const handleAttendanceClick = (studentName: string) => {
    if (pendingAttendance && pendingAttendance.name === studentName) {
      handleSecondClick(studentName)
    } else {
      handleFirstClick(studentName)
    }
  }

  // 1시간 20분 경과시 출석 인정/미인정 처리
  const handleLateAttendance = (confirm: boolean) => {
    if (!lateStudent) return
    setAttendances((prev) =>
      prev.map((a) =>
        a.name === lateStudent.name && a.status === 'pending' && a.firstClickTime?.getTime() === lateStudent.firstClickTime.getTime()
          ? { ...a, status: (confirm ? 'confirmed' : 'absent') as 'confirmed' | 'absent' }
          : a
      )
    )
    setShowLateDialog(false)
    setLateStudent(null)
  }

  // 학생별 출석 상태 반환
  const getStudentStatus = (studentName: string) => {
    const latest = [...attendances].reverse().find((a) => a.name === studentName)
    return latest?.status
  }

  return (
    <Router>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar onStudentManagementClick={() => setIsStudentManagementOpen(true)} />
        <Container maxWidth="sm" sx={{ flex: 1, py: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            출석체크
          </Typography>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {students.length === 0 && (
                <Typography color="text.secondary">학생관리에서 학생을 추가해주세요.</Typography>
              )}
              {students.map((student) => (
                <Button
                  key={student.id}
                  variant="contained"
                  color={getStudentStatus(student.name) === 'confirmed' ? 'success' : 'primary'}
                  onClick={() => handleAttendanceClick(student.name)}
                  disabled={getStudentStatus(student.name) === 'confirmed'}
                >
                  {student.name}
                  {getStudentStatus(student.name) === 'pending' && (
                    <Chip label="출석 중" size="small" sx={{ ml: 1 }} />
                  )}
                  {getStudentStatus(student.name) === 'confirmed' && (
                    <Chip label="출석 완료" color="success" size="small" sx={{ ml: 1 }} />
                  )}
                  {getStudentStatus(student.name) === 'absent' && (
                    <Chip label="미인정" color="error" size="small" sx={{ ml: 1 }} />
                  )}
                </Button>
              ))}
            </Box>
          </Paper>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              출석 목록
            </Typography>
            <List>
              {attendances.map((attendance) => (
                <ListItem key={attendance.id} divider>
                  <ListItemText
                    primary={attendance.name}
                    secondary={
                      <>
                        {format(attendance.date, 'yyyy년 MM월 dd일 HH:mm:ss', { locale: ko })}
                        <br />
                        상태: {
                          attendance.status === 'confirmed' ? '출석' :
                          attendance.status === 'pending' ? '출석 중' :
                          attendance.status === 'late' ? '지각' : '미인정'
                        }
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Container>
        <StudentManagement
          open={isStudentManagementOpen}
          onClose={() => setIsStudentManagementOpen(false)}
          attendances={attendances}
          students={students}
          onAddStudent={handleAddStudent}
        />
        <Dialog open={showLateDialog} onClose={() => setShowLateDialog(false)}>
          <DialogTitle>출석 확인</DialogTitle>
          <DialogContent>
            <Typography>
              {lateStudent?.name}님의 출석이 1시간 20분이 지났습니다. 출석을 인정하시겠습니까?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleLateAttendance(false)}>미인정</Button>
            <Button onClick={() => handleLateAttendance(true)}>출석 인정</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Router>
  )
}

export default App

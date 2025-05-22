import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Paper,
  Chip
} from '@mui/material'
import { format, subDays, isAfter } from 'date-fns'
import { ko } from 'date-fns/locale'

interface Student {
  id: number
  name: string
}

interface StudentManagementProps {
  open: boolean
  onClose: () => void
  attendances: Array<{
    id: number
    date: Date
    name: string
    status: 'confirmed' | 'pending' | 'late' | 'absent'
  }>
  students: Student[]
  onAddStudent: (studentName: string) => void
}

export default function StudentManagement({ open, onClose, attendances, students, onAddStudent }: StudentManagementProps) {
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [newStudentName, setNewStudentName] = useState('')

  const handlePasswordSubmit = () => {
    if (password === '1007') {
      setIsAuthenticated(true)
    } else {
      alert('비밀번호가 올바르지 않습니다.')
    }
    setPassword('')
  }

  const handleAddStudent = () => {
    if (!newStudentName.trim()) {
      alert('학생 이름을 입력해주세요.')
      return
    }
    if (students.some((student) => student.name === newStudentName.trim())) {
      alert('이미 존재하는 학생입니다.')
      return
    }
    onAddStudent(newStudentName.trim())
    setNewStudentName('')
  }

  // 출석 상태 및 마지막 출석일 계산
  const getStudentStatus = (studentName: string) => {
    const latest = [...attendances].reverse().find((a) => a.name === studentName)
    return latest?.status
  }
  const getStudentLastAttendance = (studentName: string) => {
    const latest = [...attendances].reverse().find((a) => a.name === studentName)
    return latest?.date
  }

  // 3일 이상 출석하지 않은 학생
  const getAbsentStudents = () => {
    const threeDaysAgo = subDays(new Date(), 3)
    return students.filter((student) => {
      const last = getStudentLastAttendance(student.name)
      return !last || isAfter(threeDaysAgo, last)
    })
  }

  const getStatusChip = (status?: string) => {
    switch (status) {
      case 'confirmed':
        return <Chip label="출석" color="success" size="small" />
      case 'pending':
        return <Chip label="출석 중" color="warning" size="small" />
      case 'late':
        return <Chip label="지각" color="error" size="small" />
      case 'absent':
        return <Chip label="미인정" color="error" size="small" />
      default:
        return <Chip label="출석 기록 없음" color="default" size="small" />
    }
  }

  if (!isAuthenticated) {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>학생 관리</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="비밀번호"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>취소</Button>
          <Button onClick={handlePasswordSubmit}>확인</Button>
        </DialogActions>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>학생 관리</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            학생 추가
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              label="학생 이름"
              value={newStudentName}
              onChange={(e) => setNewStudentName(e.target.value)}
            />
            <Button variant="contained" onClick={handleAddStudent}>
              추가
            </Button>
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            3일 이상 출석하지 않은 학생
          </Typography>
          <Paper>
            <List>
              {getAbsentStudents().map((student) => (
                <ListItem key={student.id} divider>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {student.name}
                        {getStatusChip(getStudentStatus(student.name))}
                      </Box>
                    }
                    secondary={
                      getStudentLastAttendance(student.name)
                        ? `마지막 출석: ${format(getStudentLastAttendance(student.name)!, 'yyyy년 MM월 dd일', { locale: ko })}`
                        : '출석 기록 없음'
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>
            전체 학생 목록
          </Typography>
          <Paper>
            <List>
              {students.map((student) => (
                <ListItem key={student.id} divider>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {student.name}
                        {getStatusChip(getStudentStatus(student.name))}
                      </Box>
                    }
                    secondary={
                      getStudentLastAttendance(student.name)
                        ? `마지막 출석: ${format(getStudentLastAttendance(student.name)!, 'yyyy년 MM월 dd일', { locale: ko })}`
                        : '출석 기록 없음'
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>닫기</Button>
      </DialogActions>
    </Dialog>
  )
} 
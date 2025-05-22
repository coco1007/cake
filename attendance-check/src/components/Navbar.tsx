import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'

interface NavbarProps {
  onStudentManagementClick: () => void
}

export default function Navbar({ onStudentManagementClick }: NavbarProps) {
  const navigate = useNavigate()

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          출석체크 시스템
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button color="inherit" onClick={() => navigate('/')}>
            출석체크
          </Button>
          <Button color="inherit" onClick={onStudentManagementClick}>
            학생관리
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
} 
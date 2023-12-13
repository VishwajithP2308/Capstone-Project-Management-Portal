import React, { useState, useEffect } from 'react';
import { useRef } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PublishProjectForm from "components/forms/PublishProjectForm";
import ProjectPreview from "../project/ProjectPreview";
import Navbar from "components/Header/navbar";
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';
import Delete from '@mui/icons-material/Delete';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  CardActions,
  TablePagination, 
  CssBaseline,
  Paper, 
  Toolbar, 
  Typography,
  CardContent, 
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import { Card } from '@mui/material';
import { Container } from '@mui/material';



// take these for search button
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  border: "1.5px solid #9F9F9F",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  width: "100%",
  marginRight:"3rem",
  marginLeft: 0,
  boxShadow: 'none',
  [theme.breakpoints.up('sm')]: {
    width: '40ch',
    marginLeft: theme.spacing(1),
    '&:focus': {
      width: '30ch', // Increase the focused width here
    },
  },
}));


const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: "none",
}));
 
const handleShareClick = (projectId) => {
  // Construct the URL for the project. This might be different for your application.
  const projectUrl = `${window.location.origin}/projects/${projectId}`;

  // Use the navigator.clipboard API to copy the URL to the clipboard
  navigator.clipboard.writeText(projectUrl).then(() => {
    // You can display a message or toast to the user indicating the link was copied.
    alert("Project link copied to clipboard!");
  }).catch((err) => {
    console.error('Could not copy text: ', err);
  });
};

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: "100%",
    height: '100%',
    boxShadow: 'none',
    [theme.breakpoints.up('sm')]: {
      width: '40ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));
/// till here



const StyledPaper = styled(Paper)(({ theme }) => ({
  marginLeft: theme.spacing(7),
  background: "whitesmoke" ,
  borderRadius: "10px",
  marginRight : theme.spacing(7),
  marginTop: theme.spacing(7),
  marginBottom: theme.spacing(7),
}));

const HeaderTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: "#0097EB" ,
  fontSize: "16px",
  fontFamily : "Poppins",
  color: theme.palette.common.white,
  whiteSpace: "normal",
  overflow: "hidden",
  textOverflow: "ellipsis"
}));

const HoverTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    cursor: 'pointer',
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: "14.5px",
  fontFamily: "Poppins",
  whiteSpace: "normal",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: "1px"
}));

const getDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1; // Months are zero-based, so we need to add 1
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function ClientDashBoard() {

  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [popup, setPopup] = useState(false);
  const [selectedProject, setSelectedProject] = useState("");
  const [preview ,setPreview] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(4);
  const [searchName, setSearchName] = useState("");
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [experienceText, setExperienceText] = useState('');
  const [skillsText, setSkillsText] = useState('');
  const [expanded, setExpanded] = React.useState({});
  const emailRef = useRef();
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [emailAddresses, setEmailAddresses] = useState('');
  const [experiences, setExperiences] = useState([]);
  const [latestExperience, setLatestExperience] = useState(() => {
    // Retrieve the stored experience from localStorage
    const savedExperience = localStorage.getItem('latestExperience');
    return savedExperience ? JSON.parse(savedExperience) : null;
  });

  const clearExperience = () => {
    localStorage.removeItem('latestExperience');
    setLatestExperience(null);
  };  

  const [email, setEmail] = useState('');

  const handleInviteStudents = () => {
    // Logic to open the invite dialog
    setInviteDialogOpen(true);
  };

  const handleCloseInviteDialog = () => {
    // Logic to close the invite dialog
    setInviteDialogOpen(false);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const sendInvites1 = async () => {
    try {
      // Add your logic to send invites here
      console.log('Sending invites to:', email);
    
      console.log('Invites sent, closing dialog');
      handleCloseInviteDialog();
    } catch (error) {
      console.error('Failed to send invites:', error);
      // Optionally, you can still close the dialog on error, or handle it differently
      handleCloseInviteDialog();
    }
  };
  
  
  const handleFormSubmit = async (experienceText, skillsText) => {
    try {
      const response = await axios.post(
        "/api/experience",
        { experienceText, skillsText },
        { headers: { "Content-Type": "application/json" } }
      );
  
      const newExperience = response.data;
      // Store the experience in localStorage
      localStorage.setItem('latestExperience', JSON.stringify(newExperience));
      setLatestExperience(newExperience);
      setFormOpen(false);
    } catch (err) {
      console.log("Error with the api", err);
    }
  };
  

  // async function sendInvites1(email, username, password) {
  //   try {
  //     const response = await fetch('/api/sendCredentials', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ email, username, password }),
  //     });
  //     if (response.ok) {
  //       console.log("Credentials sent successfully");
  //     } else {
  //       console.log("Failed to send credentials");
  //     }
  //   } catch (error) {
  //     console.error("Error: ", error);
  //   }
  // }
  
  
  
  const handleClick = (id) => {
    setPopup(true);
    setSelectedProject(id);
}

  const handleOpenForm = () => {
    setFormOpen(true);
  }

  const handleCloseForm = () => {
    setFormOpen(false);
  }

  const formData = {
    experienceText,
    skillsText,
    // Include any other fields or information, like user ID
  };
  


  useEffect(() => {
    async function fetchTableData() {
      try {
        const response = await axios.get('/api/projects');
        setProjects(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchTableData();
    }, []);

  useEffect(() => {
      if (searchName) {
        const filtered = projects.filter((project) => project.name.toLowerCase().includes(searchName.toLowerCase()));
        setFilteredProjects(filtered);
      } else {
        setFilteredProjects(projects);
      }
  }, [projects, searchName]);


  const handleClose = () => {
    setPreview(false);
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleExpandClick = (projectId) => {
    setExpanded(prevExpanded => ({
      ...prevExpanded,
      [projectId]: !prevExpanded[projectId], // Toggle the boolean value for the specific project ID
    }));
  };

  const handleSearchNameChange = (event) => {
    setSearchName(event.target.value);
    if (searchName) {
      const filtered = projects.filter((project) => project.name.toLowerCase().includes(searchName.toLowerCase()));
      setFilteredProjects(filtered);
    } else {
      setFilteredProjects(projects);
    }
  }  

  
  // const handleExpandClick = () => {
  //   setExpanded(!expanded);
  // };
  
  return (
    <>
            <Navbar position="relative">
            </Navbar>
      <main>
      {preview && <ProjectPreview projectId={selectedProject}  handleClose={handleClose} />}
      

      
      
  <Grid container spacing={2} justifyContent="center">
  <Grid item xs={12} sm={6} md={6}>
            {" "}
            {/* Half the width on sm and md screens */}
            <Card
              style={{ backgroundColor: "white", border: "1px solid black" }}
            >
              <CardContent style={{ padding: 0 }}>
                {formOpen ? (
                  <form>
                    {/* Add your form fields here */}
                    <Button variant="contained" color="primary" type="submit">
                      Submit
                    </Button>
                  </form>
                ) : (
                  <div>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleOpenForm}
                      startIcon={<AddIcon />}
                      style={{
                        width: "100%",
                        backgroundColor: "#4caf50",
                        color: "white",
                        textTransform: "none",
                        borderRadius: 0,
                      }}
                    >
                      <Typography variant="h6">Add experience</Typography>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            {/* The Dialog component for formOpen would be here */}
            <Dialog open={formOpen} onClose={handleCloseForm} fullScreen>
              <DialogContent>
                <TextField
                  label="Tag your experience to help companies/students find it in the marketplace"
                  variant="outlined"
                  fullWidth
                  value={experienceText}
                  onChange={(e) => setExperienceText(e.target.value)}
                />
              </DialogContent>
              <DialogContent>
                <TextField
                  label="Skills/Technologies"
                  variant="outlined"
                  fullWidth
                  value={skillsText}
                  onChange={(e) => setSkillsText(e.target.value)}
                />
              </DialogContent>
              <DialogActions>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCloseForm}
                >
                  Close
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  onClick={() => handleFormSubmit(experienceText, skillsText)}
                >
                  Submit
                </Button>
              </DialogActions>
            </Dialog>
          </Grid>

  <Grid item xs={12} sm={4} md={4}> {/* Also half the width on sm and md screens */}
  <Card style={{ backgroundColor: 'white', border: '1px solid #e0e0e0', boxShadow: '0 2px 4px 0 rgba(0,0,0,0.1)' }}>
      <CardContent style={{ padding: 16 }}>
        <Search style={{ width: '100%', margin: '0 auto', display: 'flex' }}> {/* Search component takes the full width */}
          <SearchIconWrapper style={{ paddingLeft: '16px' }}>
            <SearchOutlinedIcon />
          </SearchIconWrapper>
          <StyledInputBase
            style={{ width: 'calc(100% - 32px)', paddingLeft: '16px' }} // Input takes remaining width minus padding and icon
            placeholder="Search by Project Name"
            inputProps={{ 'aria-label': 'search' }}
            value={searchName}
            onChange={handleSearchNameChange}
          />
        </Search>
      </CardContent>
    </Card>
  </Grid>
  <React.Fragment>
            <Grid container spacing={2} justifyContent="center">
              {/* Other Grid items */}
              <Grid item xs={12} sm={4} md={4}>
                <Card
                  style={{
                    backgroundColor: "white",
                    border: "1px solid #e0e0e0",
                    boxShadow: "0 2px 4px 0 rgba(0,0,0,0.1)",
                  }}
                >
                  <CardContent style={{ padding: 16 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleInviteStudents}
                      startIcon={<AddIcon />}
                      style={{
                        width: "100%",
                        backgroundColor: "#4caf50",
                        color: "white",
                        textTransform: "none",
                        borderRadius: 0,
                      }}
                    >
                      Invite Learners
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Invite Students Dialog */}
            <Dialog open={inviteDialogOpen} onClose={handleCloseInviteDialog}>
              <DialogTitle>Invite Learners</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Enter the email addresses of the students you wish to invite.
                </DialogContentText>
                <TextField
                  autoFocus
                  margin="dense"
                  id="email"
                  label="Email Address"
                  type="email"
                  fullWidth
                  variant="outlined"
                  value={email}
                  onChange={handleEmailChange}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseInviteDialog} color="primary">
                  Cancel
                </Button>
                <Button
                  onClick={sendInvites1}
                  color="primary"
                  variant="contained"
                >
                  Send Invites
                </Button>
              </DialogActions>
            </Dialog>
          </React.Fragment>
        </Grid>
<Grid item xs={12} sm={6} md={6}>
  {latestExperience && (
    <Card style={{ backgroundColor: "white", border: "1px solid black", marginBottom: '10px' }}>
      <CardContent>
      <Typography variant="h6">My Experiences</Typography>
        <Typography variant="body1">{latestExperience.experienceText}</Typography>
        <Typography variant="body1">{latestExperience.skillsText}</Typography>
        {/* Display other details from the latest experience here */}
      </CardContent>
    </Card>
  )}
</Grid>


<StyledPaper>
        <Toolbar sx={{height:"100px"}}>
         
         <Typography
           variant="h5"
           noWrap
           component="div"
           sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } , color: "#0097EB", fontFamily:"Poppins" }}
         >
           Your Projects
         </Typography>
         <PublishProjectForm data={projects} setData={setProjects} />
         <Box sx={{ml:1.5}} ></Box>
        </Toolbar>

        <Grid container spacing={2}> 
               {filteredProjects
               .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
               .map((project, index) => (

                
        <Grid item xs={12} sm={4} md={4} lg={3} key={project._id}> {/* Adjust the grid breakpoints as required */}
          <Card sx={{ maxWidth: 345 }}> {/* You can adjust width as necessary */}
            <CardContent onClick={() => { setSelectedProject(project._id); setPreview(true); }}>
              <Typography variant="h5" component="div">
                {project.name}
              </Typography>
              <Typography variant="body2">
                Skills: {project.skills}
              </Typography>
              <Typography variant="body2">
                Created On: {getDate(project.createdAt)}
              </Typography>
              <Typography variant="body2">
                Created By: {project.createdBy}
              </Typography>
            </CardContent>
            <CardActions disableSpacing>
            {/* <IconButton aria-label="add to favorites">
          <FavoriteIcon />
           </IconButton> */}
           <IconButton aria-label="share" onClick={() => handleShareClick(project._id)}>
              <ShareIcon />
           </IconButton>

            <IconButton
              onClick={() => handleExpandClick(project._id)}
              aria-expanded={expanded[project._id] || false}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </IconButton>
          </CardActions>
          <Collapse in={expanded[project._id] || false} timeout="auto" unmountOnExit>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <CircularProgress variant="determinate" value={project.progress || 0} />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <CircularProgress variant="determinate" value={70} />
            </Box>
            <Typography variant="caption" display="block" gutterBottom>
                Assigned To: {project.assignedTo || 'N/A'}
              </Typography>
              <CardActions sx={{ justifyContent: 'flex-end' }}>
                <IconButton color="error" onClick={() => handleClick(project._id)} aria-label="delete">
                  <Delete />
                </IconButton>
              </CardActions>
            </CardContent>
          </Collapse>
        </Card>
      </Grid>
         ))
        }
       </Grid>
        
        <TablePagination
          sx = {{marginRight:"1.5rem"}}
          component="div"
          count={filteredProjects.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </StyledPaper>

    
      </main>      

    </>
  );
}

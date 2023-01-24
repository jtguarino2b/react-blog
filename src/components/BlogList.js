import {useRef, useState, useEffect} from 'react';
import {useNavigate  } from 'react-router-dom';

// Materials UI
import { 
    Grid, 
    Paper, 
    TextField,
    Button, 
    Modal,
    Box,
    Alert,
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';

// Components
import BlogListTable from './BlogListTable';

// Styles
import '../styles/blogList.scss';

const LOCAL_STORAGE_KEY = 'isLogin';
const LOCAL_STORAGE_USERTOKEN = 'token';
const LOCAL_STORAGE_USER = 'user';

const BlogList = () => {
    const API_URL = 'http://api.blogs';
    const navigate = useNavigate();
    const inputTitle = useRef();
    const inputArticle = useRef();

    const [errorMessage, setErrorMessage] = useState({});
    const [blogList, setBlogList] = useState([]);
    const [ajaxMethod, setAjaxMethod] = useState({});
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState({title: "", article: ""});

    const userToken = JSON.parse(localStorage.getItem(LOCAL_STORAGE_USERTOKEN));
    const userName = JSON.parse(localStorage.getItem(LOCAL_STORAGE_USER));
    let accessToken = (userToken === null) ?'': userToken.accessToken.split('-');

    useEffect(() => {
        if(userToken === null && userName === null ) return;
        handleGetBlog();
    },[])

    useEffect(() => {
        const getIsLogin = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
        if(!getIsLogin) {
            navigate('/');
            return;
        }
    },[navigate, blogList]);

    // Modal Config | Styles
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        bgcolor: 'background.paper',
        border: '1px solid #000',
        boxShadow: 20,
        pt: 2,
        px: 4,
        pb: 3,
    }; 

    const handleOpen = () => {
        setOpen(true);
        setErrorMessage({});
        setAjaxMethod({method: "POST", id:''})
    };
    const handleClose = () => {
        setOpen(false);
    };
    const handleInputTitle = (e) => {
        const title = e.target.value
        setInput({...input, title: title})
    }
    const handleInputArticle = (e) => {
        const article = e.target.value
        setInput({...input, article: article})
    }


    const handleLogout = () => {
        localStorage.setItem(LOCAL_STORAGE_KEY, false);
        localStorage.removeItem(LOCAL_STORAGE_USERTOKEN);
        localStorage.removeItem(LOCAL_STORAGE_USER);
        navigate('/');
    };

    // Create/Update Article
    const handleCreateBlog = () => {
        const title = inputTitle.current.value;
        const article = inputArticle.current.value;

        // POST request using fetch with error handling
        const requestOptions = {
            method: ajaxMethod.method,
            headers: { 
                'Content-Type': 'application/json' ,
                'Authorization' : 'Bearer ' + accessToken[0],
            },
            body: JSON.stringify({ 
                user_id: accessToken[1],
                title: title, 
                article: article
            })
        };     

        fetch(API_URL + '/api/blogs'+ ajaxMethod.id , requestOptions)
            .then(async response => {
                const isJson = response.headers.get('content-type')?.includes('application/json');
                const data = isJson && await response.json();
                
                // // check for error response
                if (!response.ok) {
                    // get error message from body or default to response status
                    // const error = (data && data.message) || response.status;
                    setErrorMessage(data.data);   
                    return;
                }
                setOpen(false);

                (ajaxMethod.method === 'POST') ? 
                    setBlogList([...blogList, data.data]) : 
                    setBlogList([...blogList]);
                
                setErrorMessage({success: data.message});
                
                setInput({});
            })
            .catch(error => {
                setOpen(false);
                setErrorMessage({error: error.toString()});   
                console.error('There was an error!', error);
            });
    }

    // Fetch Articles
    const handleGetBlog = () => {
    
        // GET request using fetch with error handling
        const requestOptions = {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json' ,
                'Authorization' : 'Bearer ' + accessToken[0],
            }
        };

        fetch(API_URL + '/api/blogs/' + accessToken[1], requestOptions)
            .then(async response => {
                const isJson = response.headers.get('content-type')?.includes('application/json');
                const data = isJson && await response.json();
                
                // // check for error response
                if (!response.ok) {
                    // get error message from body or default to response status
                    // const error = (data && data.message) || response.status;
                    setErrorMessage(data.data);   
                    return;
                }
               
                setOpen(false);
                setErrorMessage({});
                setBlogList(data.data);
            })
            .catch(error => {
                setErrorMessage({error: error.toString()});   
                console.error('There was an error!', error);
            });
    }

    const handleUpdateBlog = (id) => {
        setOpen(true);
        setAjaxMethod({method: "PUT", id: "/"+id});

        const newBlogList = [...blogList];
        const blog = newBlogList.find(blogs => blogs.id === id );
        setInput({title: blog.title, article: blog.article})
    }

    // Delete Article
    const handleRemoveBlog = (id) => {

        // DELETE request using fetch with error handling
        const requestOptions = {
            method:'DELETE',
            headers: { 
                'Content-Type': 'application/json' ,
                'Authorization' : 'Bearer ' + accessToken[0],
            }
        };
        
        fetch(API_URL + '/api/blogs/'+id, requestOptions)
            .then(async response => {
                const isJson = response.headers.get('content-type')?.includes('application/json');
                const data = isJson && await response.json();
                
                // // check for error response
                if (!response.ok) {
                    // get error message from body or default to response status
                    // const error = (data && data.message) || response.status;
                    setErrorMessage(data.data);   
                    return;
                }
                setOpen(false);
                setErrorMessage({success: data.message});

                const newBlogList = [...blogList];
                const blog = newBlogList.find(blogs => blogs.id === id )
                blog.id = !blog.id;

                setBlogList(newBlogList);
            })
            .catch(error => {
                setErrorMessage({error: error.toString()});   
                console.error('There was an error!', error);
            });
    }
    
    return (
        <div className="blog-list-wrap">
            <Grid>
                <Paper elevation={0} className="inner-content">
                    <Grid align='center'>
                        <h1>Blog List</h1>
                        
                        {errorMessage.success && <Alert severity="success" className="success"> {errorMessage.success} </Alert>}
                        {errorMessage.error && <Alert severity="error" className="success"> {errorMessage.error} </Alert>}
                        
                        <Grid className="button-wrap"align="right">
                            <h2 align="left">Welcome {(userName === null) ? '' :userName.name}</h2>
                            <Button onClick={handleOpen} type='button' color='primary' variant="contained" size="medium" className="create-blog" startIcon={<AddIcon />}>Create Blog</Button>
                            <Button onClick={handleLogout} type='button' color='primary' variant="outlined" size="medium" className="create-blog">Sign Out</Button>
                        </Grid>
                    </Grid>

                    <BlogListTable 
                        blog ={{blogList}} 
                        handleUpdateBlog = {handleUpdateBlog}
                        handleRemoveBlog = {handleRemoveBlog} 
                        />  
                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="parent-modal-title"
                        aria-describedby="parent-modal-description"
                        >
                    <Box sx={{ ...style}}>
                        <h2 id="parent-modal-title">Add Blog</h2>
                        
                        <TextField onChange={handleInputTitle} inputRef={inputTitle} value={input.title} label='Title' placeholder='Title' variant="standard" className="title" fullWidth required/>
                        {errorMessage && <div className="error"> {errorMessage.title} </div>}
                        
                        <TextField onChange={handleInputArticle}  inputRef={inputArticle} value={input.article} label='Article' placeholder='Aricle' variant="standard" className="article" rows={4} fullWidth multiline required/>
                        {errorMessage && <div className="error"> {errorMessage.article} </div>}
                        
                        <Button onClick={handleCreateBlog} type='submit' color='primary' variant="contained"  className="btn-save" sx={{marginTop: 3}}>Save</Button>
                    </Box>
                </Modal>          
                </Paper>
            </Grid>
        </div>
    )
}

export default BlogList
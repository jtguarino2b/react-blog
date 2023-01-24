
// Materials UI
import { 
    TableCell, 
    TableRow, 
    Link,
} from '@mui/material';

import moment from "moment";



const Blog = ({blog, handleRemoveBlog, handleUpdateBlog}) => {
       
    // Delete article
    const deleteBlog = () => {
        handleRemoveBlog(blog.id);
    }

    // Update article
    const handleUpdateBlogs = () => {
        handleUpdateBlog(blog.id);
    }

    return (
        
        <TableRow
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            className= {
                ( !blog.id ) ? "hidden" : '' // hide row
            }
            >
            <TableCell component="td" scope="row">
                {blog.title}
            </TableCell>
            <TableCell component="td" scope="row">
                {blog.article}
            </TableCell>
            <TableCell align="left">{ moment(blog.created_at).format('DD/MM/YYYY H:mm A') }</TableCell>
            <TableCell align="right">
                <Link className="edit" underline="hover"onClick={handleUpdateBlogs}>Edit</Link>
                <Link className="delete" underline="hover" onClick={deleteBlog}>Delete</Link>
            </TableCell>  
        </TableRow>
    )
}

export default Blog
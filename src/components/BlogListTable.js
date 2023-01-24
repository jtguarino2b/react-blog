// Materials UI
import { 
    Paper, 
    Table,
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
} from '@mui/material';

// components
import Article from './Blog';

const LOCAL_STORAGE_USERTOKEN = 'token';

const BlogListTable = ({blog, handleUpdateBlog, handleRemoveBlog}) => { 
    const {blogList} = blog;

    // get current user ID
    const userToken = JSON.parse(localStorage.getItem(LOCAL_STORAGE_USERTOKEN));
    let userID = (userToken === null) ?'': userToken.accessToken.split('-');
   
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell>Article</TableCell>
                        <TableCell align="left">Date Created</TableCell>
                        <TableCell align="right">Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                { 
                 
                    (blogList.length > 0) ?
                    blogList.map((row, index) => (
                        <Article 
                            key={index} 
                            blog={row} 
                            handleUpdateBlog={handleUpdateBlog}
                            handleRemoveBlog={handleRemoveBlog}
                        />
                    ))
                    : 
                    <TableRow>
                        <TableCell align="left">No data found</TableCell>
                    </TableRow>
               
                }
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default BlogListTable
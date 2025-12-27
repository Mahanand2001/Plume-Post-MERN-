
import { Link } from 'react-router-dom'
import PostAuthor from './PostAuthor.jsx'


const PostItem = ({postID,category,title,description,authorID,thumbnail,createdAt}) => {

    const shortDescription = description.length > 145 ? description.substring(0, 145) + '...' : description;
    const shortTitle = title.length > 47 ? title.substring(0, 47) + '...' : title;
  return (
    <article className="post">
        <Link to={`/posts/${postID}`}><div className="post__thumbnail">
            <img src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${thumbnail}`} alt={title} />
        </div></Link>
        <div className="post_content">
            <Link to={`/posts/${postID}`} >
            <h3>{shortTitle}</h3>
            </Link>
            <p dangerouslySetInnerHTML={{__html: shortDescription}}></p>
            <div className="post__footer">
                <PostAuthor authorID={authorID} createdAt={createdAt}/>
                <Link to={`/posts/categories/${category}`} className='btn category'>
                {category}</Link>
            </div>
        </div>
    </article>
  )
}

export default PostItem
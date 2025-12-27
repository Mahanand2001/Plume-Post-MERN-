import React,  {useState ,useContext, useEffect} from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../context/userContext';
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import axios from 'axios'

const POST_CATEGORIES = [
  "Technology","Business","Art","Education","Entertainment","Sports","Science","Politics","Finance","Environment","Weather","Uncategorized","History","Culture","Automotive","Real Estate","Music"
]

const EditPost = () => {
  const [title, setTitle] = React.useState('')
  const [category, setCategory] = React.useState('Uncategorized')
  const [description, setDescription] = React.useState('')
  const [thumbnail, setThumbnail] = React.useState(null)
  const [error, setError] = useState('')

  const editor = useEditor({
    extensions: [StarterKit],
    content: description,
    onUpdate: ({ editor }) => {
      setDescription(editor.getHTML())
    },
  })
  const navigate = useNavigate();
  const {id} = useParams(); 
    
    
      const {currentUser} = useContext(UserContext);
      const token = currentUser?.token;
    
      //redirect to login page for any user who isn't logged in 
      useEffect(()=> {
        if(!token){
          navigate('/login')
        }
      },[])


      useEffect(() => {
        const getPost = async () => {
          try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/${id}`)
            setTitle(response.data.title)
            setDescription(response.data.description)
            setCategory(response.data.category)
            if(editor){
              editor.commands.setContent(response.data.description)
            }

          } catch (error) {
            setError(error)
          }

        }
        getPost();
      }, []) 

      const editPost= async (e) => {
          e.preventDefault();
          const postData = new FormData();
          postData.set('title', title)
          postData.set('category', category)
          postData.set('description', description)
          postData.set('thumbnail', thumbnail)

          try {
            const response = await axios.patch(`${process.env.REACT_APP_BASE_URL}/posts/${id}`, postData, {withCredentials: true, headers: {Authorization: `Bearer ${token}`}})
            if(response.status == 200){
              return navigate(`/`)
            }

          } catch (e) {
            setError(e.response.data.message);
          }
          }

  return (
    <section className="create-post">
      <div className="container">
        <h2>Edit Post</h2>
        {error && <p className="form__error-message">
          {error}
        </p>}
        <form action="" className="form create-post__form" onSubmit={editPost}>
          <input 
            type="text" 
            placeholder='Title' 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            autoFocus
          />
          
          <select 
            name="category" 
            value={category} 
            onChange={e => setCategory(e.target.value)}
          >
            {POST_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <div className="editor-wrapper">
            <label>Description:</label>
            {editor && (
              <div className="editor-toolbar">
                <button 
                  type="button"
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={editor.isActive('bold') ? 'is-active' : ''}
                >
                  Bold
                </button>
                <button 
                  type="button"
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={editor.isActive('italic') ? 'is-active' : ''}
                >
                  Italic
                </button>
                <button 
                  type="button"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                  className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
                >
                  H2
                </button>
                <button 
                  type="button"
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                  className={editor.isActive('bulletList') ? 'is-active' : ''}
                >
                  Bullet List
                </button>
                <button 
                  type="button"
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                  className={editor.isActive('orderedList') ? 'is-active' : ''}
                >
                  Ordered List
                </button>
              </div>
            )}
            <EditorContent editor={editor} className="editor" />
          </div>

          <input 
            type="file" 
            onChange={e => setThumbnail(e.target.files[0])} 
            accept='image/png, image/jpeg'
          />

          <button type="submit" className="btn primary">Update</button>
        </form>
      </div>
    </section>
  )
}

export default EditPost
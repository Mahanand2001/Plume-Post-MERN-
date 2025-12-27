import React,{useState, useContext, useEffect} from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { UserContext } from '../context/userContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'



const POST_CATEGORIES = [
  "Technology","Business","Art","Education","Entertainment","Sports","Science","Politics","Finance","Environment","Weather","Uncategorized","History","Culture","Automotive","Real Estate","Music"
]

const CreatePosts = () => {
  const [title, setTitle] = React.useState('')
  const [category, setCategory] = React.useState('Uncategorized')
  const [description, setDescription] = React.useState('')
  const [thumbnail, setThumbnail] = React.useState(null)
  const navigate = useNavigate();
  const [error, setError] = useState('');


  const {currentUser} = useContext(UserContext);
  const token = currentUser?.token;

  //redirect to login page for any user who isn't logged in 
  useEffect(()=> {
    if(!token){
      navigate('/login')
    }
  },[])

  const editor = useEditor({
    extensions: [StarterKit],
    content: description,
    onUpdate: ({ editor }) => {
      setDescription(editor.getHTML())
    },
  })

  const createPost = async (e) => {
    e.preventDefault();
    const postData = new FormData();
    postData.set('title', title)
    postData.set('category', category)
    postData.set('description', description)
    postData.set('thumbnail', thumbnail)

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/posts`, postData, {withCredentials: true, headers: {Authorization: `Bearer ${token}`}})
      if(response.status == 201){
        return navigate('/')
      }

    } catch (e) {
      setError(e.response.data.message);
    }
  }

  return (
    <section className="create-post">
      <div className="container">
        <h2>Create Post</h2>
        {error && <p className="form__error-message">
          {error}
        </p>}
        <form action="" className="form create-post__form" onSubmit={createPost}>
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

          <button type="submit" className="btn primary">Create</button>
        </form>
      </div>
    </section>
  )
}

export default CreatePosts
"use client"
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function TimelinePost({ post }: { post: any }) {
  const [comments, setComments] = useState<any[]>([])
  const [newComment, setNewComment] = useState("")
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(post.likes || 0)

  useEffect(() => {
    fetchComments()
  }, [post.id])

  async function fetchComments() {
    const { data } = await supabase
     .from('comments')
     .select('*')
     .eq('post_id', post.id)
     .order('created_at', { ascending: true })

    if (data) {
      // DEDUPE FIX - removes duplicates like "Can they take me without experience?"
      const unique = data.filter((v,i,a) =>
        a.findIndex(t => t.content === v.content && t.author_name === v.author_name) === i
      )
      setComments(unique)
    }
  }

  async function handleLike() {
    if (liked) return
    setLiked(true)
    setLikes(likes + 1)
    await supabase.from('posts').update({ likes: likes + 1 }).eq('id', post.id)
  }

  async function handleComment() {
    if (!newComment.trim()) return

    const comment = {
      post_id: post.id,
      content: newComment,
      author_name: "Work Community Member",
      created_at: new Date().toISOString()
    }

    const { data } = await supabase.from('comments').insert([comment]).select()
    if (data) {
      setComments([...comments, data[0]])
      setNewComment("")
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow p-4 border-l-4 border-yellow-400">
      {/* Post Header */}
      <div className="flex justify-between items-center mb-2">
        <span className="font-black text-[#0a4d2a] text-sm">{post.author_name}</span>
        <span className="bg-yellow-400 text-[#0a4d2a] px-2 py-1 rounded text-xs font-bold">{post.location}</span>
      </div>

      {/* Post Content */}
      <p className="text-gray-800 mb-3">{post.content}</p>

      {/* Stats */}
      <div className="flex justify-between text-xs text-gray-500 mb-3 border-b pb-2">
        <span>{likes} likes</span>
        <span>{comments.length} comments • 0 shares</span>
      </div>

      {/* Actions */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1 px-4 py-2 rounded-xl font-bold ${liked? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
        >
          ♥ {liked? 'Liked' : 'Like'}
        </button>
        <button className="flex items-center gap-1 text-gray-600">💬 Comment</button>
        <button className="flex items-center gap-1 text-gray-600">↗ Share</button>
      </div>

      {/* Comments - NO MORE DUPLICATES */}
      <div className="space-y-2">
        {comments.map((c, idx) => (
          <div key={`${c.id}-${idx}`} className="bg-gray-50 rounded-xl p-3">
            <p className="font-bold text-sm text-gray-800">{c.author_name}</p>
            <p className="text-sm text-gray-700">{c.content}</p>
          </div>
        ))}
      </div>

      {/* Add Comment */}
      <div className="flex gap-2 mt-4">
        <input
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          placeholder="Add a work-related comment..."
          className="flex-1 bg-gray-50 border rounded-full px-4 py-2 text-sm outline-none focus:border-[#0a4d2a]"
          onKeyDown={e => e.key === 'Enter' && handleComment()}
        />
        <button onClick={handleComment} className="bg-black text-white px-5 py-2 rounded-full text-sm font-bold">Send</button>
      </div>
    </div>
  )
                                       }

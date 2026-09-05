
"use client"
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Timeline() {
  const [posts, setPosts] = useState<any[]>([])
  const [content, setContent] = useState("")
  const [postType, setPostType] = useState("opportunity")
  const [location, setLocation] = useState("Secunda")
  const [loading, setLoading] = useState(false)

  // Load posts
  useEffect(() => {
    fetchPosts()
  }, [])

  async function fetchPosts() {
    const { data } = await supabase
     .from('posts')
     .select('*')
     .order('created_at', { ascending: false })
    if (data) setPosts(data)
  }

  async function publishPost() {
    if (!content.trim()) return alert("Write something bro!")
    setLoading(true)

    const newPost = {
      content,
      post_type: postType,
      location,
      author_name: "Guardian Founder",
      author_role: "MY GUARDIAN LINK",
      likes: 0,
      created_at: new Date().toISOString()
    }

    const { data, error } = await supabase
     .from('posts')
     .insert([newPost])
     .select()

    if (error) {
      alert("RLS Error again! Run master fix: " + error.message)
    } else {
      setPosts([data[0],...posts])
      setContent("")
      alert("🔥 POSTED! Welders in Secunda is LIVE!")
    }
    setLoading(false)
  }

  return (
    <div className="guardian-timeline p-4 max-w-2xl mx-auto">
      {/* CREATE POST */}
      <div className="bg-white rounded-2xl shadow-lg p-4 border-2 border-[#0a4d2a]">
        <h2 className="text-[#0a4d2a] font-black text-lg mb-3">Share Opportunity / Wisdom</h2>

        <div className="flex gap-2 mb-3">
          <select value={postType} onChange={e=>setPostType(e.target.value)} className="bg-[#0a4d2a] text-yellow-400 px-3 py-2 rounded-lg font-bold">
            <option value="opportunity">🔥 Opportunity</option>
            <option value="wisdom">💡 Wisdom</option>
            <option value="hiring">📢 Hiring</option>
          </select>
          <input value={location} onChange={e=>setLocation(e.target.value)} placeholder="Location e.g. Secunda" className="flex-1 border-2 border-yellow-400 rounded-lg px-3 py-2 font-bold" />
        </div>

        <textarea
          value={content}
          onChange={e=>setContent(e.target.value)}
          placeholder="Hey there opportunities for welders in Secunda..."
          className="w-full h-24 border-2 border-gray-200 rounded-xl p-3 focus:border-[#0a4d2a] outline-none"
        />

        <button
          onClick={publishPost}
          disabled={loading}
          className="mt-3 w-full bg-[#0a4d2a] text-yellow-400 font-black py-3 rounded-xl hover:bg-black transition"
        >
          {loading? "Publishing..." : "Publish to Timeline 🚀"}
        </button>
      </div>

      {/* FEED */}
      <div className="mt-6 space-y-4">
        {posts.map(post => (
          <div key={post.id} className="bg-white rounded-2xl shadow p-4 border-l-4 border-yellow-400">
            <div className="flex justify-between">
              <span className="font-black text-[#0a4d2a]">{post.author_name}</span>
              <span className="bg-yellow-400 text-[#0a4d2a] px-2 py-1 rounded text-xs font-bold">{post.location}</span>
            </div>
            <p className="mt-2 text-gray-800">{post.content}</p>
            <div className="mt-3 text-xs text-gray-500">{new Date(post.created_at).toLocaleString()} • {post.post_type}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

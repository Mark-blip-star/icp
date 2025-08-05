import React from 'react';
import Header from '../(home)/header';
import Footer from '../(home)/footer';
import { recoleta, outfit } from '../fonts/fonts';
import Link from 'next/link';
import { blogs } from './data/blogs';

export default function BlogListPage() {
  return (
    <div className={`min-h-screen flex flex-col bg-background ${outfit.variable} ${recoleta.variable}`}>
      <Header />
      <main className="flex-1 w-full max-w-4xl mx-auto py-16 px-4">
        <h1 className="font-recoleta text-5xl md:text-6xl font-black text-center mb-10 text-[#0A66C2] tracking-tight">Tiger Blog</h1>
        <p className="font-outfit text-lg text-gray-600 text-center mb-14 max-w-2xl mx-auto">Hey! We're here to help you stop sucking at LinkedIn outreach. Most advice out there is trash, so we're sharing everything we know for free. Even if you never use Tiger, you'll learn how to actually connect with people instead of annoying them.</p>
        <div className="grid gap-10 md:grid-cols-2">
          {blogs.map((blog) => (
            <article
              key={blog.id}
              className="rounded-3xl border border-gray-200 shadow-lg p-8 bg-white hover:shadow-xl transition-shadow flex flex-col justify-between min-h-[260px]"
            >
              <div>
                <h2 className="font-recoleta text-2xl font-bold mb-3 text-[#0A66C2]">
                  <Link href={`/blog/${blog.slug}`} className="hover:underline focus:underline outline-none">
                    {blog.title}
                  </Link>
                </h2>
                <p className="font-outfit text-gray-700 mb-6 text-base leading-relaxed">{blog.summary}</p>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-400 font-outfit mt-auto pt-2 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <img 
                    src={`/${blog.author === 'Adhiraj Hangal' ? 'Adhiraj_Profile.jpeg' : 'Tarun_Profile.jpeg'}`} 
                    alt={blog.author}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span>By {blog.author}</span>
                </div>
                <span>{new Date(blog.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
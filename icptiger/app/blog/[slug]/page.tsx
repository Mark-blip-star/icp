import React from 'react';
import Header from '../../(home)/header';
import Footer from '../../(home)/footer';
import { recoleta, outfit } from '../../fonts/fonts';
import { notFound } from 'next/navigation';
import { blogs } from '../data/blogs';
import { Metadata } from 'next';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const blog = blogs.find((b) => b.slug === params.slug);
  if (!blog) return {};

  return {
    title: `${blog.title} | Tiger Blog`,
    description: blog.seoDescription || blog.summary,
    openGraph: {
      title: blog.title,
      description: blog.seoDescription || blog.summary,
      type: 'article',
      authors: [blog.author],
      publishedTime: blog.date,
    },
  };
}

export async function generateStaticParams() {
  return blogs.map((blog) => ({
    slug: blog.slug,
  }));
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const blog = blogs.find((b) => b.slug === params.slug);
  if (!blog) return notFound();

  return (
    <div className={`min-h-screen flex flex-col bg-background ${outfit.variable} ${recoleta.variable}`}>
      <Header />
      <main className="flex-1 w-full max-w-3xl mx-auto py-16 px-4">
        <h1 className="font-recoleta text-4xl md:text-5xl font-black text-center mb-8 text-[#0A66C2] tracking-tight">{blog.title}</h1>
        <div className="flex items-center justify-center gap-4 text-sm text-gray-400 font-outfit mb-8">
          <div className="flex items-center gap-2">
            <img 
              src={`/${blog.author === 'Adhiraj Hangal' ? 'Adhiraj_Profile.jpeg' : 'Tarun_Profile.jpeg'}`} 
              alt={blog.author}
              className="w-6 h-6 rounded-full object-cover"
            />
            <span>By {blog.author}</span>
          </div>
          <span>•</span>
          <span>{new Date(blog.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
        <div className="prose max-w-none font-outfit text-gray-800">
          {blog.content ? blog.content : <p>{blog.summary}</p>}
        </div>
      </main>
      <Footer />
    </div>
  );
}
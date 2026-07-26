"use client";

import React, { use, useEffect } from "react";
import { BLOG_POSTS } from "@/data/blogs";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { ReadAloudButton } from "@/components/ReadAloudButton";

export default function SingleBlogPostPage({ params }: { params: { slug: string } | Promise<{ slug: string }> }) {
  // Safely unwrap params whether passed synchronously or as a Promise
  const resolvedParams = params && typeof (params as any).then === "function" ? use(params as Promise<{ slug: string }>) : (params as { slug: string });
  const slug = resolvedParams?.slug;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  useEffect(() => {
    if (post) {
      document.title = `${post.title} | AP Lab`;
    }
  }, [post]);

  if (!post) {
    return (
      <main className="min-h-screen bg-[#03040a] text-white flex flex-col items-center justify-center p-6 font-manrope">
        <Navbar />
        <div className="text-center py-40 space-y-4">
          <h1 className="text-4xl font-bold">Article Not Found</h1>
          <p className="text-white/60 text-sm">The article you are looking for does not exist or has been moved.</p>
          <Link href="/blog" className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold transition-all">
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Blogs</span>
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#03040a] text-white selection:bg-medical-teal selection:text-black overflow-hidden relative font-manrope">
      
      {/* Background Gradient Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-primary-purple/10 blur-[160px] rounded-full" />
      </div>

      <Navbar />

      {/* Article Hero Container matching Turbo AI reference layout */}
      <article className="relative pt-36 sm:pt-40 md:pt-44 pb-24 px-6 md:px-[120px] z-10">
        <div className="max-w-4xl mx-auto">
          
          {/* Top Breadcrumb & Meta Header Row */}
          <div className="flex items-center justify-between text-sm font-mono text-white/40 mb-6">
            <div className="flex items-center space-x-2">
              <Link href="/blog" className="text-white/50 hover:text-emerald-400 transition-colors font-medium">
                Blog
              </Link>
              <span>/</span>
              <span className="text-purple-400 font-semibold">{post.category}</span>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <span>{post.date}</span>
              <span>•</span>
              <span>{post.readTime}</span>
            </div>
          </div>

          {/* Article Header Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-8 leading-[1.15]">
            {post.title}
          </h1>

          {/* Author Badge & Hashtags Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-10 border-b border-white/10 mb-10">
            <div className="flex items-center space-x-4">
              <img 
                src={post.author.avatar} 
                alt={post.author.name} 
                className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
              />
              <div className="flex flex-col">
                <span className="font-bold text-white text-base">{post.author.name}</span>
                <span className="text-xs text-white/50">{post.author.role}</span>
              </div>
            </div>

            {/* Top Hashtag Pills (Right of Author) */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {post.tags.map((tag) => (
                  <span 
                    key={tag} 
                    className="px-4 py-1.5 rounded-full bg-[#0e1628] border border-[#1d2d4a] text-[#8ab4f8] text-xs font-mono font-semibold tracking-wider"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Read Aloud Audio Player Circle Button */}
          <div className="flex items-center justify-end mb-6">
            <ReadAloudButton textToRead={post.content} title={post.title} />
          </div>

          {/* Cover Image */}
          <div className="rounded-3xl overflow-hidden mb-12 border border-white/10 shadow-2xl aspect-[16/9]">
            <img 
              src={post.coverImage} 
              alt={post.title} 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Article HTML Body matching Turbo AI reading typography */}
          <div 
            className="prose prose-invert max-w-none font-inter text-[17px] text-white/80 leading-[1.8] space-y-6"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />



          {/* Back to Blogs Footer CTA */}
          <div className="mt-16 pt-8 border-t border-white/10 flex justify-between items-center">
            <Link 
              href="/blog"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white text-sm font-semibold transition-all hover:-translate-x-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to all posts</span>
            </Link>
          </div>

        </div>
      </article>

      <Footer />
    </main>
  );
}

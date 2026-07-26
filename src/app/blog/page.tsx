"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BLOG_POSTS } from "@/data/blogs";
import Link from "next/link";
import { ArrowUpRight, Eye } from "lucide-react";

export default function BlogIndexPage() {
  useEffect(() => {
    document.title = "Blogs | AP Lab";
  }, []);

  return (
    <main className="min-h-screen bg-[#03040a] text-white selection:bg-medical-teal selection:text-black overflow-hidden relative font-manrope">
      
      {/* Background Gradient Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary-purple/10 blur-[150px] rounded-full" />
        <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-medical-teal/10 blur-[140px] rounded-full" />
      </div>

      <Navbar />

      {/* Hero Section matching Turbo AI reference layout */}
      <section className="relative pt-36 sm:pt-40 md:pt-44 pb-16 px-6 md:px-[120px] z-10">
        <div className="max-w-5xl mx-auto text-center flex flex-col items-center">
          
          {/* Main Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="font-manrope text-5xl sm:text-6xl md:text-[80px] font-extrabold tracking-tight mb-6 leading-tight text-white"
          >
            Announcements and Blogs
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-white/60 text-lg md:text-xl leading-relaxed max-w-xl mx-auto"
          >
            Updates, announcements, and insights from the AP Lab team! :)
          </motion.p>

        </div>
      </section>

      {/* Blog Cards Grid Section */}
      <section className="px-6 md:px-[120px] pb-32 z-10 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {BLOG_POSTS.map((post, index) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link 
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col bg-[#0b0c16]/90 border border-white/10 hover:border-white/25 rounded-[28px] overflow-hidden transition-all duration-400 hover:-translate-y-2 shadow-[0_15px_35px_rgba(0,0,0,0.5)] h-full justify-between"
                >
                  <div>
                    {/* Cover Image */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-neutral-900">
                      <img 
                        src={post.coverImage} 
                        alt={post.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>

                    {/* Card Content */}
                    <div className="p-7 space-y-4">
                      {/* Meta Date & Read Time */}
                      <div className="flex items-center space-x-2 text-xs font-mono text-white/40">
                        <span>{post.date}</span>
                        <span>•</span>
                        <span>{post.readTime}</span>
                        <span>•</span>
                        <div className="flex items-center space-x-1 text-purple-400">
                          <Eye className="w-3 h-3" />
                          <span>2.6k views</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                        {post.title}
                      </h2>

                      {/* Excerpt */}
                      <p className="text-white/50 text-sm leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>

                      {/* Hashtag Pills matching reference screenshot */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {post.tags.map((tag) => (
                            <span 
                              key={tag} 
                              className="px-3 py-1 rounded-full bg-[#0e1628] border border-[#1d2d4a] text-[#8ab4f8] text-[11px] font-mono font-semibold tracking-wide"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Author Footer Badge matching Turbo AI reference */}
                  <div className="px-7 pb-7 pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center space-x-3.5">
                      <img 
                        src={post.author.avatar} 
                        alt={post.author.name} 
                        className="w-10 h-10 rounded-full object-cover border border-white/20"
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white">{post.author.name}</span>
                        <span className="text-xs text-white/40">{post.author.role}</span>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-white/15 flex items-center justify-center text-white/60 group-hover:text-white transition-all">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>

                </Link>
              </motion.div>
            ))}

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

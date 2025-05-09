
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ChevronLeft, Calendar, User } from 'lucide-react';

const BlogPage = () => {
  const blogPosts = [
    {
      id: 1,
      title: "How QR Codes Are Changing Product Authentication",
      excerpt: "Explore how modern QR code technology is revolutionizing how brands protect themselves from counterfeiting...",
      date: "May 1, 2025",
      author: "Amina Bouaziz",
      category: "Industry Trends",
      imageUrl: "https://images.unsplash.com/photo-1501127122-f385ca6ddd9d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    },
    {
      id: 2,
      title: "5 Ways Counterfeit Products Harm Your Brand",
      excerpt: "Counterfeit products don't just cut into your profits—they can damage your reputation and customer trust...",
      date: "April 22, 2025",
      author: "Karim Hadj",
      category: "Brand Protection",
      imageUrl: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    },
    {
      id: 3,
      title: "Customer Case Study: How Algerian Cosmetic Brand Stopped Fakes",
      excerpt: "Learn how a local skincare company reduced counterfeit products by 75% using QR authentication...",
      date: "April 15, 2025",
      author: "Leila Mansouri",
      category: "Case Studies",
      imageUrl: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    },
    {
      id: 4,
      title: "The Technical Side of QR Authentication: How It Works",
      excerpt: "A deeper look at the encryption and security measures that make QR authentication effective...",
      date: "April 8, 2025",
      author: "Ahmed Benali",
      category: "Technology",
      imageUrl: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    },
    {
      id: 5,
      title: "Why Customer Feedback Matters in Product Authentication",
      excerpt: "Authentication is just the beginning—find out how customer reviews create additional value...",
      date: "March 29, 2025",
      author: "Yasmine Khelil",
      category: "Customer Engagement",
      imageUrl: "https://images.unsplash.com/photo-1568992687947-868a62a9f521?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto py-16 px-4">
        <Button asChild variant="outline" className="mb-8">
          <Link to="/" className="flex items-center gap-2">
            <ChevronLeft size={16} />
            Back to Home
          </Link>
        </Button>
        
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">Blog</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Link to="/login" key={post.id} className="group">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
                  <div className="aspect-video relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                    <div className="absolute bottom-3 left-3 z-20 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">{post.category}</div>
                    <img 
                      src={post.imageUrl} 
                      alt={post.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">{post.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">{post.excerpt}</p>
                    <div className="flex items-center text-gray-500 text-sm">
                      <div className="flex items-center mr-4">
                        <Calendar size={14} className="mr-1" />
                        <span>{post.date}</span>
                      </div>
                      <div className="flex items-center">
                        <User size={14} className="mr-1" />
                        <span>{post.author}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Button asChild variant="outline" className="border-blue-500 text-blue-600">
              <Link to="/login">View More Articles</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;

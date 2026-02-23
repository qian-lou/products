---
title: "Music Streaming App"
slug: "music-streaming-app"
date: "2025-06-10"
excerpt: "A cross-platform music streaming application with offline playback, personalized playlists, and social sharing. Built with Flutter and a Go microservices backend."
tags:
  - Flutter
  - Go
  - gRPC
  - Redis
cover: "/images/works/music-app-cover.svg"
demo: "https://music-demo.vercel.app"
github: "https://github.com/username/music-app"
featured: false
order: 4
---

## Project Overview

A full-featured music streaming platform inspired by Spotify and Apple Music, designed for indie artists and listeners who value discoverability.

### Key Features

- **Offline Mode**: Download tracks for offline listening with DRM protection
- **Smart Playlists**: AI-powered playlist generation based on listening habits
- **Social Feed**: Share what you're listening to with followers
- **Artist Dashboard**: Analytics and upload tools for independent musicians

## Architecture

- **Mobile**: Flutter with BLoC pattern for state management
- **Backend**: Go microservices with gRPC inter-service communication
- **Storage**: MinIO for audio files, PostgreSQL for metadata
- **Caching**: Redis for session management and playback state

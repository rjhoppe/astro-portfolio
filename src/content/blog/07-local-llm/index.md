---
title: "Super Charge Your Homelab with AI While Paying NOTHING"
description: ""
date: "12/21/2025"
draft: true
---
### Is this you?
Let me first try to narrow down the target audience for this:

* Do you have gaming rig that was built sometime in the last 5-10 years? 
* Do you find yourself playing video games less and less and programming more and more? OR do you find yourself only gaming on the weekends while your rig collects dust during the weekedays? 
* Do you want to get in on all the AI hype, BUT you HATE spending money?

If you read any of those and thought "yep, that's me" I might have the answer. AND it should take no more than 15 minutes...

### Assumptions
I am going to assume here that if you are any kind of gamer, you probably have a rig with some flavor of Windows 10/11 installed. Yes, I know, it's the year of the Linux desktop (and I am all here for it), but if you are playing video games on Linux, this process is going to involve some extra steps that are not covered here. But seriously, keep fighting the good fight 💪

### Background
I have wanted to setup OpenCode for use on my personal projects and dive more into some AI powered n8n workflows. Technically, you could just create a Mistral account, generate an API token and use either of their two smaller, FREE models. I do that for my pnpm-summary project and it works pretty damn well. But after doing a little research, I realized I may need a more coding specific model for OpenCode developer work. 

### Choosing Model Provider
I have a Nvidia 3060 (12 GB) on a Windows 10 machine. What I needed was an ability to download and serve the LLM model of my choice and then make that model accessible via API across my entire local network. It is likely that this local model will be used by many different local services throughout the day and I want to plan for that kind of utilization.

You have a couple of different options to accomplish this, but these seem to be the most popular:
* Ollama
* LMStudio

I choose Ollama just because I have some familiarity with it from playing around with it on other projects. HOWEVER, it is worth noting that ollama can be difficult to work with depending on what you are trying to do. For example, OpenCode uses OpenAI specified JSON for invoking tool calls. Ollama will sometimes structure it's JSON responses for API calls in a slightly different way (not OpenAI format) that will cause tool calls to fail. This could also be the fault of the model as well and how it was trained. 

For example, I tried using the qwen2.5-coder:7B-instruct model in OpenCode. For the life of me, I could not get it to reliably invoke tools such as reading and editing files in my repo. I tried several different approaches to get it to work, but it really was a limitation of that model's training. Once I switched over to a qwen3 model, it began to work.

While this example was the fault of the model, the issue could also be with Ollama as well. If you run into Ollama specific problems, you can try using an litellm proxy that intercepts your Ollama model responses and conforms the output to more commonly accepted structures (like the OpenAI I mentioned earlier). It's not too much extra work to setup.

Users have also reported that LMStudio avoids a lot of the Ollama quirkiness. It is a bit heavier from a resource consumption standpoint, but it might well be worth it avoid some of the Ollama related "gotchas" and headaches.

### Downloading Ollama

### Choosing a Model

### Serving Your Model Locally

### Invoking Your Model

### Fun Time
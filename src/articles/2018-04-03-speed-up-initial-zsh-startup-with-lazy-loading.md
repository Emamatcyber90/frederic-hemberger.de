---
layout: post.hbs
lang: en
deck: Shell
title: Speed up initial zsh startup with lazy-loading
intro: >
    I'm using various auto-completions for tools like Docker, Kubernetes, the AWS CLI and Node.js. Over time, together with other initialization code snippets, starting a new shell got slower and slower. But then I found an easy way to get back to speed.
date: 2018-04-04
---

I stumbled upon a blog post about [zsh lazy-loading](https://peterlyons.com/problog/2018/01/zsh-lazy-loading) and really liked the idea. The gist: You create a shell function with the same name as the binary you want to load. It has preference over executable files. The function takes care of additional setup and sourcing auto-completion, then executes the binary.

So far, so good, but in the example, the function was called each time instead of the binary, doing all the setup steps over and over again. Instead, you can unset the function after its first invocation and all subsequent calls will execute the binary directly. This example shows how it works for the `kubectl` command:

```bash
# Check if 'kubectl' is a command in $PATH
if [ $commands[kubectl] ]; then

  # Placeholder 'kubectl' shell function:
  # Will only be executed on the first call to 'kubectl'
  kubectl() {

    # Remove this function, subsequent calls will execute 'kubectl' directly
    unfunction "$0"

    # Load auto-completion
    source <(kubectl completion zsh)

    # Execute 'kubectl' binary
    $0 "$@"
  }
fi
```

_**Note:** If you're using bash, use `if type kubectl &>/dev/null; then` and `unset -f "$0"` instead._

With this lazy-loading technique, my zsh startup time **went down from 2085ms to 373ms!**


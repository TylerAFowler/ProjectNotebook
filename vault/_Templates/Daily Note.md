---
type: daily
date: <% tp.file.title %>
---
# <% window.moment(tp.file.title, "YYYY-MM-DD").format("dddd, MMMM D, YYYY") %>

## Log
*One bullet per thing you worked on. Start with the project link so the weekly report can group it, e.g. `- [[Project X]] fixed the null-route geocoding bug`.*
- 

## 🧾 Commits
<%* tR += await tp.user.git(tp, "dailyBlock", { date: tp.file.title }) %>

## Done today
```tasks
done on <% tp.file.title %>
short mode
```

## Due / overdue
```tasks
not done
due on or before <% tp.file.title %>
sort by due
short mode
```

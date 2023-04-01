# Contact list thing

Repo for an interview process at ~~redacted~~

## Results

![image](https://user-images.githubusercontent.com/37847523/229252811-283c3031-ccf8-497d-b8b6-2dc29e78df88.png)

With a limited ammount of time, I didn't acomplish everything I wanted, namely a queue for adding entries to the database in batches and making most things non-blocking so the user can keep using the app while a CSV is being parsed and uploaded.

I'm happy with my implementation of most of the UI; A highlight is the interaction for mapping columns from an uploaded .csv file to our expected columns. Some elements are missing, like feedback for uploads, automatic navigation when creating a list, modals closing on "primary action" click.

All in all, I feel like I made a good job in prioritizing and adapting to changes in information, ideally I'd have identified some of these points of improvement earlier since multiple of them are critical. I'm confident in trade-offs I made in tech choices considering the nature of this project as a take home assignment.

During the second half of the timeline, I struggled to keep a healthy balance of work, life and this assignment. My anxiety grew as the deadline approached culminating in an Igor that didn't feel confident about what he did and that would collapse after delivery. 

## Specification
### Overview

The goal of this project is to upload different contact list as CSV, map, parse and save in the database.

### Requirements

- Front-end Next.js with Typescript
- Use Supabase to store data

### Timeline

This project should be completed by the end of the week.

- Day 1 (Fri 24 Mar): Start & Code
- Day 2 (Mon 27 Mar): Code + 10min Daily 
- Day 3 (Tue 28 Mar): Code + 10min Daily 
- Day 4 (Wed 29 Mar): Code + 10min Daily 
- Day 5 (Thu 30 Mar): Code + 10min Daily
- Day 6 (Fri 31 Mar): Demo for the team

### Deliverables

The final deliverable for this project should include:

#### Front-end

- A view with a table of contacts (name, email, subscribed, created_at), a way to upload a contact list as CSV, and searchable
- Once the CSV is uploaded, the user needs a way to map each field
    - eg: If in the CSV instead of `name` is `First Name`, the user needs to map `First Name -> name`

#### API

- User should be able to import different contact lists, but we should verify and not save duplicated entries based on their emails
    - Eg: User uploads `list1.csv` that has `bu@resend.com` , when they upload `list2.csv` which also has `bu@resend.com` , we shouldn’t save that entry in our database

#### SDK

- Script to do make the request to the API (SDK-like) — should be really simple, the above is more important

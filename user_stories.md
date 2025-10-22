# Tennis Camp Connect - Features by Persona

This document provides a comprehensive overview of all features available to each user persona in the Tennis Camp Connect application.

## 🎾 Application Overview

Tennis Camp Connect is a comprehensive tennis camp management application built with Next.js, Supabase, and Tailwind CSS. The application provides role-based access for three distinct user personas: **Players**, **Coaches**, and **Administrators**.

### User Roles
- **Player**: Tennis camp participants who can view camp details, complete assessments, and access camp resources
- **Coach**: Tennis instructors who manage players, create reports, and track player progress
- **Admin**: System administrators who manage users, create camps, and oversee the entire application

---

## 👤 PLAYER FEATURES

### 🏠 Home Dashboard (`/home`)
- **As a player, I can see a personalized welcome message with my first name**, so that I feel welcomed and recognized in the application.
- **As a player, I can view a dynamic camp countdown** (D-X for upcoming, Day X of Y for active, Completed for finished), so that I always know exactly when my camp starts or my current progress.
- **As a player, I can see camp overview cards with package information**, so that I can quickly understand what type of camp I'm enrolled in.
- **As a player, I can see my assessment status and get prompted to complete it**, so that I know if I need to complete my technical assessment for the coach.
- **As a player, I can access quick navigation links to all camp-related pages**, so that I can easily move between different sections of my camp information.

### 🎾 Tennis Page (`/camp/[id]/tennis`)
- **As a player, I can view the tennis court location on Google Maps**, so that I know exactly where to go for my tennis sessions.
- **As a player, I can see detailed camp information** (dates, package type, tennis hours, coach name), so that I have all the essential details about my camp.
- **As a player, I can complete a comprehensive pre-camp technical assessment**, so that my coach can design personalized sessions based on my skill level and goals.
- **As a player, I can edit my existing assessment responses**, so that I can update my information if my situation changes.
- **As a player, I can view detailed post-camp reports from my coach**, so that I can understand my performance, improvements, and get recommendations for future training.
- **As a player with a "No Tennis" package, I can see appropriate messaging**, so that I understand this package doesn't include tennis activities.

### 📅 Schedule Page (`/camp/[id]/schedule`)
- **As a player, I can see a "Coming Soon" placeholder for daily schedules**, so that I know this feature is being developed.
- **As a player, I can view recommendations for Marrakech** (Food, Relax, Excursion categories), so that I can discover local attractions and activities during my stay.
- **As a player, I can see price range indicators** (€, €€, €€€) for recommendations, so that I can choose activities that fit my budget.
- **As a player, I can click on Google Maps links for recommendations**, so that I can easily navigate to recommended locations.

### 🏨 Stay Page (`/camp/[id]/stay`)
- **As a player with a stay package, I can view detailed accommodation information**, so that I know where I'll be staying and how to contact the accommodation.
- **As a player, I can see accommodation photos and amenities**, so that I can visualize my accommodation and understand what facilities are available.
- **As a player with a "Tennis Only" package, I am automatically redirected to the tennis page**, so that I don't see irrelevant accommodation information.

### 📋 Essentials Page (`/camp/[id]/essentials`)
- **As a player, I can access comprehensive travel information for Marrakech**, so that I'm well-prepared for my stay in Morocco.
- **As a player, I can view collapsible sections** (Water & Safety, eSIM & Data, Money & Payments, etc.), so that I can easily find specific information I need.
- **As a player, I can learn about water safety and hydration tips**, so that I stay healthy during my tennis sessions in the hot climate.
- **As a player, I can get information about court rental** (23€/hour), so that I know the cost if I want to play additional tennis outside camp hours.
- **As a player, I can access practical information** (transportation, food, shopping, health), so that I can navigate Marrakech confidently and safely.

### 📝 Assessment Form (`/player/assessment/form`)
- **As a player, I can provide my personal information and playing background**, so that my coach understands my tennis experience and history.
- **As a player, I can describe my game profile** (confident aspects, improvement areas), so that my coach can focus on the right areas during training.
- **As a player, I can report any current injuries or physical limitations**, so that my coach can adapt training to keep me safe and healthy.
- **As a player, I can set my learning preferences and motivations**, so that my coach can tailor the teaching approach to my learning style.
- **As a player, I can define my main goals and expectations**, so that my coach can design sessions that help me achieve what I want from the camp.
- **As a player, I can save and edit my assessment responses**, so that I can update my information as needed.
- **As a player, I can see character counts for text areas**, so that I know how much detail I've provided in my responses.

---

## 🏆 COACH FEATURES

### 🏠 Home Dashboard (`/home`)
- **As a coach, I can see a personalized welcome message**, so that I feel welcomed when logging into the application.
- **As a coach, I can view my next upcoming camp start date**, so that I know when my next coaching assignment begins.
- **As a coach, I can see the total number of camps assigned to me**, so that I understand my current workload.
- **As a coach, I can access quick navigation to player management**, so that I can easily start managing my players.

### 👥 Player Management (`/coach/players`)
- **As a coach, I can search for players by name**, so that I can quickly find specific players I'm looking for.
- **As a coach, I can view a list of all my assigned players**, so that I can see all players under my supervision.
- **As a coach, I can see each player's camp assignments with dates**, so that I know which camps each player is enrolled in.
- **As a coach, I can view package type badges for each player's camps**, so that I understand what type of experience each player is having.
- **As a coach, I can see camp status** (upcoming, in-progress, completed), so that I know the current state of each camp.
- **As a coach, I can see assessment and report counts for each player**, so that I know which players have completed assessments and which reports I've created.
- **As a coach, I can click on individual players to view their detailed profiles**, so that I can access comprehensive player information.

### 👤 Individual Player Page (`/coach/players/[id]`)
- **As a coach, I can view a player's complete profile and history**, so that I have all the context I need about the player.
- **As a coach, I can see all camps assigned to a specific player**, so that I understand the player's camp history and experience.
- **As a coach, I can review a player's pre-camp assessments**, so that I can understand their skill level, goals, and areas for improvement before the camp starts.
- **As a coach, I can view detailed responses to technical questions**, so that I can design personalized training sessions based on the player's specific needs.
- **As a coach, I can create new post-camp reports**, so that I can provide detailed feedback to players about their performance and progress.
- **As a coach, I can edit existing reports**, so that I can update or refine my feedback as needed.
- **As a coach, I can use a structured report form with 5 comprehensive sections**, so that I can provide thorough and organized feedback covering all important aspects of the player's performance.
- **As a coach, I can view all previous reports for a player**, so that I can track the player's progress over time across multiple camps.

### 📊 Report Creation (`/components/features/ReportForm`)
- **As a coach, I can provide a performance summary**, so that players get an overall assessment of how they performed during the camp.
- **As a coach, I can assess technical skills** (serve, forehand, backhand, volley, etc.), so that players understand their technical strengths and areas for improvement.
- **As a coach, I can document areas where the player improved during camp**, so that players can see their progress and feel motivated.
- **As a coach, I can highlight the player's key strengths and natural abilities**, so that players understand what they do well and can build on those strengths.
- **As a coach, I can provide specific recommendations for future training**, so that players know how to continue improving after the camp ends.
- **As a coach, I can see character counts for each section**, so that I know how detailed my feedback is.
- **As a coach, I can save and update reports**, so that I can refine my feedback and ensure it's comprehensive before publishing.
- **As a coach, I can ensure all required sections are completed**, so that players receive complete and valuable feedback.

---

## 👨‍💼 ADMIN FEATURES

### 🏠 Home Dashboard (`/home`)
- **As an admin, I can see a management overview**, so that I have quick access to all administrative functions.
- **As an admin, I can access navigation cards for user and camp management**, so that I can easily navigate to different administrative areas.

### 👥 User Management (`/admin/users`)
- **As an admin, I can filter users by role** (All, Players, Coaches), so that I can focus on specific user types when needed.
- **As an admin, I can view all users with their creation dates**, so that I can see the user base and track when users were added.
- **As an admin, I can see role-based badges for each user**, so that I can quickly identify each user's role.
- **As an admin, I can create new players** by entering first and last names, so that I can add new tennis camp participants to the system.
- **As an admin, I can create new coaches** by entering first and last names, so that I can add new tennis instructors to the system.
- **As an admin, I can have usernames auto-generated** using the pattern `{first_letter}{lastname}`, so that usernames are consistent and easy to remember.
- **As an admin, I can have passwords auto-generated** using the pattern `{username}{1 digit}{4 alphanumeric}`, so that passwords are secure and follow a consistent format.
- **As an admin, I can see the generated credentials displayed once**, so that I can provide login information to new users securely.
- **As an admin, I can ensure username uniqueness** by automatically adding numbers if duplicates exist, so that each user has a unique identifier.

### 🏕️ Camp Management (`/admin/camps`)
- **As an admin, I can view all camps with status badges**, so that I can see the current state of all camps in the system.
- **As an admin, I can see coach assignments and player counts for each camp**, so that I can understand camp staffing and enrollment.
- **As an admin, I can see package type indicators for each camp**, so that I can quickly identify what type of experience each camp offers.
- **As an admin, I can create new camps** by setting start and end dates, so that I can schedule tennis camp sessions.
- **As an admin, I can select package types** (Tennis Only, Stay & Play, Luxury Stay & Play, No Tennis), so that I can offer different camp experiences.
- **As an admin, I can set tennis hours for applicable packages**, so that I can define the amount of tennis instruction for each camp.
- **As an admin, I can set camp capacity** (1-4 players), so that I can control the size of each camp group.
- **As an admin, I can add accommodation details for stay packages**, so that players have complete information about their lodging.
- **As an admin, I can upload accommodation photos**, so that players can see what their accommodation looks like.
- **As an admin, I can add accommodation contact information and Google Maps links**, so that players can easily contact and locate their accommodation.
- **As an admin, I can assign coaches to camps** by selecting from available coaches, so that each camp has a qualified instructor.
- **As an admin, I can assign players to camps** (up to the capacity limit), so that I can manage camp enrollments.
- **As an admin, I can add daily schedules for each camp**, so that players know what activities are planned for each day.
- **As an admin, I can edit existing camps** to update all details, so that I can modify camp information as needed.
- **As an admin, I can modify player assignments** for existing camps, so that I can adjust enrollments when needed.
- **As an admin, I can update camp schedules**, so that I can change daily activities as plans evolve.
- **As an admin, I can track camp status** (upcoming, in-progress, completed), so that I can monitor the lifecycle of each camp.

---

## 🔐 Authentication & Security

### Login System (`/login`)
- **As any user, I can log in using my username and password**, so that I can access the application securely.
- **As any user, I can access different features based on my role** (Player, Coach, Admin), so that I only see functionality relevant to my responsibilities.
- **As any user, my session is managed securely**, so that I stay logged in during my session but am logged out when appropriate.

### Access Control
- **As any user, I can only access protected routes after authentication**, so that unauthorized users cannot access sensitive information.
- **As any user, I see different navigation menus based on my role**, so that I only see options relevant to my user type.
- **As any user, I can only access my own data**, so that my privacy is protected and I cannot see other users' information.

---

## 🎨 User Interface Features

### Design System
- **As any user, I can see a consistent color palette** (Grapefruit Red, Citrus Yellow, Lime Green, Royal Blue), so that the application has a cohesive visual identity.
- **As any user, I can read clear typography** (Montserrat headings, Inter body text), so that all text is easily readable.
- **As any user, I can use the application on any device** (mobile, tablet, desktop), so that I can access the system from anywhere.

### UI Components
- **As any user, I can see information displayed in cards**, so that content is organized and easy to scan.
- **As any user, I can interact with different button types** (Primary, Secondary, Outline), so that I can perform various actions clearly.
- **As any user, I can see status indicators through badges**, so that I can quickly understand the state of different elements.
- **As any user, I can expand and collapse content sections**, so that I can focus on the information I need.
- **As any user, I can see alerts for success, errors, and information**, so that I'm informed about the results of my actions.
- **As any user, I can see loading indicators**, so that I know when the system is processing my requests.

---

## 📱 Mobile Responsiveness

- **As any user, I can use the application on my mobile phone**, so that I can access camp information while traveling.
- **As any user, I can use the application on my tablet**, so that I can have a comfortable viewing experience on a medium-sized screen.
- **As any user, I can use the application on my desktop computer**, so that I can have the full experience with a large screen and keyboard.

---

## 🔄 Data Flow & Integration

### Database Integration
- **As any user, I can see real-time updates to data**, so that I always have the most current information.
- **As any user, I can upload images for accommodation photos**, so that visual information is properly stored and displayed.

### API Endpoints
- **As a player, I can access my assessment and report data through secure APIs**, so that my personal information is protected.
- **As a coach, I can manage player data and create reports through secure APIs**, so that I can perform my coaching duties effectively.
- **As an admin, I can manage users and camps through secure APIs**, so that I can maintain the system efficiently.

---

## 🚀 Future Features (Planned)

### Player Features
- **As a player, I will be able to view detailed daily schedules**, so that I know exactly what activities are planned for each day.
- **As a player, I will receive real-time notifications**, so that I'm informed about camp updates and important reminders.
- **As a player, I will be able to view a photo gallery**, so that I can see and share memories from my camp experience.

### Coach Features
- **As a coach, I will be able to track player analytics over time**, so that I can see long-term progress and improvement patterns.
- **As a coach, I will be able to plan detailed training sessions**, so that I can prepare structured and effective lessons.
- **As a coach, I will be able to communicate directly with players**, so that I can provide ongoing support and answer questions.

### Admin Features
- **As an admin, I will be able to view analytics dashboards**, so that I can understand camp performance and user engagement.
- **As an admin, I will be able to perform bulk operations**, so that I can efficiently manage multiple users or camps at once.
- **As an admin, I will be able to generate comprehensive reports**, so that I can analyze system usage and make data-driven decisions.

---

*This document provides a complete overview of all current features available to each user persona in the Tennis Camp Connect application. Features are organized by persona and include both frontend user interfaces and backend API functionality.*

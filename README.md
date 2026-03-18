# Anne-Gaelle Colom - Portfolio Site

A professional portfolio website showcasing EdTech projects and development work.

## About

This portfolio highlights educational technology solutions I've built, with a focus on practical tools that solve real problems for academic staff and students.

## Site Structure

```
portfolio-site/
├── index.html              # Main landing page
├── cv.html                # Full CV/Experience page
├── css/
│   └── style.css          # Styling for all pages
├── projects/
│   └── student-cards-extension.html  # Detailed project page
└── images/
    └── StudentCardScreenshot.png    # Project screenshots
```

## Local Development

1. Simply open `index.html` in your browser
2. No build process required - it's plain HTML/CSS

## Deploying to GitHub Pages

### Option 1: New Repository (Recommended for User Site)

1. **Create a new GitHub repository named `yourusername.github.io`**
   - Replace `yourusername` with your actual GitHub username
   - This creates a user site that will be accessible at `https://yourusername.github.io`

2. **Initialize git in the portfolio-site folder:**
   ```bash
   cd portfolio-site
   git init
   git add .
   git commit -m "Initial portfolio site"
   ```

3. **Push to GitHub:**
   ```bash
   git remote add origin https://github.com/yourusername/yourusername.github.io.git
   git branch -M main
   git push -u origin main
   ```

4. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Click **Settings** → **Pages**
   - Under "Source", select **main** branch
   - Click **Save**

5. **Your site will be live at:** `https://yourusername.github.io`
   - May take a few minutes to deploy

### Option 2: Project Repository (Alternative)

If you prefer to keep this in a project repository:

1. **Create a new repository with any name** (e.g., `portfolio`)

2. **Push the code:**
   ```bash
   cd portfolio-site
   git init
   git add .
   git commit -m "Initial portfolio site"
   git remote add origin https://github.com/yourusername/portfolio.git
   git branch -M main
   git push -u origin main
   ```

3. **Enable GitHub Pages:**
   - Go to **Settings** → **Pages**
   - Select **main** branch
   - Click **Save**

4. **Your site will be live at:** `https://yourusername.github.io/portfolio`

## Customisation Checklist

Before deploying, update the following:

### In `index.html`:
- [x] Update GitHub link: Already set to `https://github.com/agcolom`
- [x] Update email: Set to `coloma@westminster.ac.uk`
- [x] Update LinkedIn: Already set to `https://www.linkedin.com/in/annegaellecolom/`
- [x] Update About Me section: Enhanced with key achievements and roles
- [x] Chrome Web Store link: Added to Student Cards Extension project

### In `projects/student-cards-extension.html`:
- [x] Loom demo video: Already added
- [x] Student card screenshot: Already added to `images/` folder
- [ ] Add Chrome Web Store link: Replace `#` with actual extension URL

### Notes:
- GitHub repository links have been intentionally removed as the project is being kept private for business purposes
- The demo video provides a comprehensive walkthrough of the extension's features

### Optional Enhancements:
- [ ] Add screenshots of the extension in action
- [ ] Add a profile photo to the hero section
- [ ] Create a custom domain (optional, but GitHub Pages supports this)
- [ ] Add more projects as you build them
- [ ] Add a blog section if desired
- [ ] Set up Google Analytics (if you want to track visitors)

## Adding Screenshots

1. Create an `images/` folder if it doesn't exist
2. Add screenshots with descriptive names:
   - `student-cards-demo.png`
   - `student-cards-pdf-output.png`
   - `sits-interface.png`
3. Reference them in your HTML:
   ```html
   <img src="../images/student-cards-demo.png" alt="Extension in action">
   ```

## Adding More Projects

To add a new project:

1. **Add a project card to `index.html`** in the `#projects` section
2. **Create a new project page** in the `projects/` folder (you can copy `student-cards-extension.html` as a template)
3. **Update the links** between the card and detailed page

## Custom Domain (Optional)

If you want to use a custom domain (e.g., `yourname.com`):

1. Purchase a domain from a registrar (Namecheap, Google Domains, etc.)
2. Add a `CNAME` file to your repository with your domain name
3. Configure DNS settings with your registrar
4. Update GitHub Pages settings to use your custom domain

See: [GitHub Pages Custom Domain Documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)

## Technologies Used

- HTML5
- CSS3 (with Flexbox and Grid)
- Responsive Design
- No JavaScript frameworks (intentionally simple)
- SVG icons inline

## License

Feel free to use this as a template for your own portfolio! Attribution appreciated but not required.

## Support

If you have questions about deploying or customising this portfolio, feel free to reach out or open an issue.

---

**Next Steps:**
1. Customise the content with your information
2. Add screenshots and images
3. Create your GitHub repository
4. Push and deploy to GitHub Pages
5. Share your portfolio URL!

# JMA Blog

A modern, responsive Jekyll blog featuring a clean design with syntax highlighting, image modals, and tag-based filtering.

## Overview

This is a personal blog built with Jekyll, showcasing posts about web development, technical interviews, and software engineering topics. The blog includes features like archive navigation, tag filtering, and a dark/light theme toggle.

## Features

- **Responsive Design**: Mobile-friendly layout that works across all devices
- **Syntax Highlighting**: Code blocks with syntax highlighting using Highlight.js
- **Tag Filtering**: Filter posts by tags for easy navigation
- **Archive Navigation**: Browse posts by year and month
- **Image Modals**: Click to enlarge images in posts
- **Theme Toggle**: Switch between light and dark themes
- **Modern UI**: Clean, card-based post layout

## Project Structure

```
blog/
├── _config.yml          # Jekyll configuration
├── _data/              # Data files (navigation)
├── _includes/          # Reusable components (navigation, footer, etc.)
├── _layouts/           # Page templates (default, post)
├── _posts/             # Blog posts (Markdown files)
├── _site/              # Generated site (do not edit)
├── assets/             # Static assets
│   ├── css/           # Stylesheets
│   ├── js/            # JavaScript files
│   └── images/        # Image files
├── Gemfile            # Ruby dependencies
└── index.html         # Homepage

```

## Getting Started

### Prerequisites

- Ruby (version 2.5 or higher)
- Bundler
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/joealfa/blog.git
cd blog
```

2. Install dependencies:
```bash
bundle install
```

3. Run the development server:
```bash
bundle exec jekyll serve
```

4. Open your browser and visit `http://localhost:4000/blog`

### Development Mode

For development with different configuration:
```bash
bundle exec jekyll serve --config _config.yml,_config_dev.yml
```

## Writing Posts

1. Create a new Markdown file in the `_posts` directory with the format:
   ```
   YYYY-MM-DD-title.md
   ```

2. Add front matter to your post:
   ```yaml
   ---
   layout: post
   title: "Your Post Title"
   date: YYYY-MM-DD
   categories: [category1, category2]
   tags: [tag1, tag2, tag3]
   image: /assets/images/your-image.jpg  # Optional
   ---
   ```

3. Write your content using Markdown below the front matter.

4. Save the file and Jekyll will automatically rebuild the site.

## Configuration

Edit `_config.yml` to customize:
- Site title and description
- Base URL
- Permalink structure
- Markdown settings

## Deployment

This blog is designed to be deployed on GitHub Pages:

1. Push your changes to GitHub
2. Enable GitHub Pages in repository settings
3. Set the source to the main branch
4. Your site will be available at `https://yourusername.github.io/blog`

## Technologies Used

- **Jekyll**: Static site generator
- **Kramdown**: Markdown processor
- **Highlight.js**: Syntax highlighting
- **JavaScript**: Interactive features (theme toggle, tag filtering, image modals)
- **CSS**: Custom styling with responsive design

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

- GitHub: [@joealfa](https://github.com/joealfa)
- Blog: [https://joealfa.github.io/blog](https://joealfa.github.io/blog)

## Acknowledgments

- Built with [Jekyll](https://jekyllrb.com/)
- Syntax highlighting by [Highlight.js](https://highlightjs.org/)
- Hosted on [GitHub Pages](https://pages.github.com/)

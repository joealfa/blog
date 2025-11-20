(function(){
  const tagButtons = Array.from(document.querySelectorAll('.tag-filter'));
  const clearBtn = document.querySelector('.tag-filter-clear');
  const posts = Array.from(document.querySelectorAll('.post-card'));
  const tagPills = Array.from(document.querySelectorAll('.tag-pill'));
  const monthHeadings = Array.from(document.querySelectorAll('.month-heading'));
  const yearHeadings = Array.from(document.querySelectorAll('.year-heading'));
  let activeTag = null;

  function applyFilter(){
    posts.forEach(post => {
      if(!activeTag){
        post.hidden = false;
        return;
      }
      const tags = (post.getAttribute('data-tags')||'').trim().split(/\s+/);
      post.hidden = !tags.includes(activeTag);
    });

    // Hide/show month headings based on visible posts
    monthHeadings.forEach(heading => {
      const monthId = heading.id;
      const postsGrid = heading.nextElementSibling;
      if(postsGrid && postsGrid.classList.contains('posts-grid')){
        const visiblePosts = Array.from(postsGrid.querySelectorAll('.post-card:not([hidden])'));
        if(visiblePosts.length === 0){
          heading.hidden = true;
          postsGrid.hidden = true;
        } else {
          heading.hidden = false;
          postsGrid.hidden = false;
        }
      }
    });

    // Hide/show year headings based on visible months
    yearHeadings.forEach(heading => {
      let nextEl = heading.nextElementSibling;
      let hasVisibleMonths = false;
      while(nextEl && !nextEl.classList.contains('year-heading')){
        if(nextEl.classList.contains('month-heading') && !nextEl.hidden){
          hasVisibleMonths = true;
          break;
        }
        nextEl = nextEl.nextElementSibling;
      }
      heading.hidden = !hasVisibleMonths;
    });

    tagButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.tag === activeTag));
    tagPills.forEach(pill => pill.classList.toggle('active', pill.dataset.tag === activeTag));
    if(clearBtn) clearBtn.hidden = !activeTag;
  }

  function setTag(tag){
    activeTag = (activeTag === tag) ? null : tag; // toggle off if same
    applyFilter();
  }

  tagButtons.forEach(btn => {
    btn.addEventListener('click', () => setTag(btn.dataset.tag));
  });
  tagPills.forEach(pill => {
    pill.addEventListener('click', (e) => { e.preventDefault(); setTag(pill.dataset.tag); });
  });
  if(clearBtn){
    clearBtn.addEventListener('click', () => setTag(null));
  }
})();

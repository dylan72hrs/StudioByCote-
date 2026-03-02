document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('galleryModal');
    if (!modal) return;

    const modalImg = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const modalPrice = document.getElementById('modalPrice');
    const closeBtn = modal.querySelector('.modal-close');
    const prevBtn = modal.querySelector('.modal-prev');
    const nextBtn = modal.querySelector('.modal-next');

    let currentImages = [];
    let currentIndex = 0;

    /* ── Open modal on card click ── */
    document.querySelectorAll('.cat-card').forEach(card => {
        card.addEventListener('click', (e) => {
            // Don't open modal if WhatsApp button was clicked
            if (e.target.closest('.btn-wa-elegante')) return;

            const imgs = card.getAttribute('data-images');
            const title = card.getAttribute('data-title') || '';
            const desc = card.getAttribute('data-desc') || '';
            const price = card.getAttribute('data-price') || '';

            currentImages = imgs ? imgs.split(',').map(s => s.trim()) : [];
            currentIndex = 0;

            modalTitle.textContent = title;
            modalDesc.textContent = desc;
            modalPrice.textContent = price;

            updateModalImage();
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    /* ── Close ── */
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('active')) return;
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowLeft') navigate(-1);
        if (e.key === 'ArrowRight') navigate(1);
    });

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    /* ── Navigation ── */
    prevBtn.addEventListener('click', (e) => { e.stopPropagation(); navigate(-1); });
    nextBtn.addEventListener('click', (e) => { e.stopPropagation(); navigate(1); });

    function navigate(dir) {
        if (currentImages.length <= 1) return;
        currentIndex = (currentIndex + dir + currentImages.length) % currentImages.length;
        updateModalImage();
    }

    function updateModalImage() {
        if (currentImages.length > 0) {
            modalImg.src = currentImages[currentIndex];
        }
    }
});

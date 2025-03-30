document.addEventListener('DOMContentLoaded', function() {
    // Kategori filtreleme
    const categoryTabs = document.querySelectorAll('.category-tab');
    const postCards = document.querySelectorAll('.post-card');

    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Aktif tab'ı güncelle
            categoryTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Seçilen kategori
            const selectedCategory = tab.getAttribute('data-category');

            // Kartları filtrele
            postCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                if (selectedCategory === 'all' || selectedCategory === cardCategory) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Newsletter form submit
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input[type="email"]').value;
            // Burada e-posta gönderme işlemi yapılacak
            alert('Bülten kaydınız alındı: ' + email);
            newsletterForm.reset();
        });
    }

    // Load More butonu için
    const loadMoreBtn = document.querySelector('.load-more button');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            // Burada daha fazla post yükleme işlemi yapılacak
            loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Yükleniyor...';
            
            // Simüle edilmiş yükleme gecikmesi
            setTimeout(() => {
                loadMoreBtn.innerHTML = 'Daha Fazla Göster';
                // Yeni postlar eklenecek
            }, 1500);
        });
    }

    // Sayfa yüklendiğinde animasyon
    postCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });

    showSkeletonLoading();
    
    // İçerik yüklenene kadar bekle
    setTimeout(() => {
        hideSkeletonLoading();
    }, 1500);
    
    // Form validasyonunu başlat
    if (newsletterForm) {
        new FormValidator(newsletterForm);
    }
});

function showSkeletonLoading() {
    const postsGrid = document.querySelector('.posts-grid');
    const template = document.querySelector('#skeleton-template');
    
    // Mevcut içeriği gizle
    postsGrid.style.opacity = '0';
    
    // Skeleton'ları ekle
    for (let i = 0; i < 3; i++) {
        postsGrid.appendChild(template.content.cloneNode(true));
    }
}

function hideSkeletonLoading() {
    const skeletons = document.querySelectorAll('.skeleton');
    skeletons.forEach(skeleton => skeleton.remove());
    
    // İçeriği göster
    document.querySelector('.posts-grid').style.opacity = '1';
} 
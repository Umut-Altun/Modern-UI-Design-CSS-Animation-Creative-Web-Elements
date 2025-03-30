document.addEventListener('DOMContentLoaded', function() {
    // Filtreleme işlevselliği
    const filterButtons = document.querySelectorAll('.filter-btn');
    const videoCards = document.querySelectorAll('.video-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Aktif buton sınıfını güncelle
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Seçilen kategori
            const selectedFilter = button.getAttribute('data-filter');

            // Filtreleme işlemi
            videoCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                // Tüm kartları göster veya kategoriye göre filtrele
                if (selectedFilter === 'all' || selectedFilter === cardCategory) {
                    card.style.display = 'flex';
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

    // Video kartlarına tıklama işlevselliği
    videoCards.forEach(card => {
        const thumbnail = card.querySelector('.video-thumbnail');
        const youtubeButton = card.querySelector('.btn-youtube');
        
        thumbnail.addEventListener('click', () => {
            youtubeButton.click();
        });
    });

    // Sayfa yüklendiğinde tüm kartları göster
    videoCards.forEach(card => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
        card.style.display = 'flex';
    });
}); 
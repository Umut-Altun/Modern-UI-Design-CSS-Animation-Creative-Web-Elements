class FormValidator {
    constructor(form) {
        this.form = form;
        this.emailInput = form.querySelector('input[type="email"]');
        this.submitButton = form.querySelector('button[type="submit"]');
        this.errorContainer = document.createElement('div');
        this.errorContainer.className = 'form-error';
        
        this.init();
    }

    init() {
        this.form.insertBefore(this.errorContainer, this.submitButton);
        
        this.emailInput.addEventListener('input', () => {
            this.validateEmail();
        });

        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.validateEmail()) {
                this.submitForm();
            }
        });
    }

    validateEmail() {
        const email = this.emailInput.value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email) {
            this.showError('E-posta adresi gerekli');
            return false;
        }
        
        if (!emailRegex.test(email)) {
            this.showError('Geçerli bir e-posta adresi giriniz');
            return false;
        }

        this.hideError();
        return true;
    }

    showError(message) {
        this.errorContainer.textContent = message;
        this.errorContainer.style.display = 'block';
        this.emailInput.classList.add('error');
    }

    hideError() {
        this.errorContainer.style.display = 'none';
        this.emailInput.classList.remove('error');
    }

    async submitForm() {
        this.submitButton.disabled = true;
        this.submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gönderiliyor...';
        
        try {
            // Burada API çağrısı yapılacak
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            this.showSuccess();
        } catch (error) {
            this.showError('Bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            this.submitButton.disabled = false;
            this.submitButton.textContent = 'Abone Ol';
        }
    }

    showSuccess() {
        this.form.innerHTML = `
            <div class="success-message">
                <i class="fas fa-check-circle"></i>
                <p>Başarıyla abone oldunuz!</p>
            </div>
        `;
    }
} 
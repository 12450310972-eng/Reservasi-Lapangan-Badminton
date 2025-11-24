   // Mobile Menu Toggle
        const burger = document.querySelector('.burger');
        const navLinks = document.querySelector('.nav-links');
        
        burger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            // Animate burger
            const spans = burger.querySelectorAll('span');
            if (navLinks.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        // Close menu when link clicked
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const spans = burger.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });

        // Smooth Scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(26, 41, 71, 0.98)';
                navbar.style.boxShadow = '0 5px 20px var(--glow-blue)';
            } else {
                navbar.style.background = 'rgba(26, 41, 71, 0.95)';
                navbar.style.boxShadow = 'none';
            }
        });

        // Animate elements on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe all cards
        document.querySelectorAll('.feature-card, .pricing-card, .testimonial-card, .gallery-item').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });

        // Update WhatsApp number (ganti dengan nomor Anda)
        const whatsappNumber = '6285183220322'; // Format: 62xxxxx
        document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
            const currentHref = link.getAttribute('href');
            link.setAttribute('href', currentHref.replace('6281234567890', whatsappNumber));
        });

        // ===== RESERVATION FORM SCRIPT =====
        
        // Konfigurasi Harga
        const pricing = {
            weekdayMorning: 50000,
            weekdayEvening: 70000,
            weekend: 80000
        };

        const happyHourDiscount = 0.20;
        const happyHourStart = 13;
        const happyHourEnd = 15;

        // Generate time slots
        const timeSlots = [
            '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', 
            '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', 
            '20:00', '21:00', '22:00'
        ];

        const timeSlotsContainer = document.getElementById('timeSlots');
        timeSlots.forEach(time => {
            const slot = document.createElement('div');
            slot.className = 'time-slot';
            slot.textContent = time;
            slot.dataset.time = time;
            slot.onclick = () => selectTimeSlot(slot);
            slot.style.cssText = 'padding: 1rem; background: var(--light-gray); border: 2px solid var(--light-gray); border-radius: 10px; text-align: center; cursor: pointer; transition: all 0.3s; font-weight: 600;';
            timeSlotsContainer.appendChild(slot);
        });

        // Set minimum date
        const resDateInput = document.getElementById('date');
        const resToday = new Date().toISOString().split('T')[0];
        resDateInput.min = resToday;

        // Court selection
        let selectedCourt = null;
        function selectCourt(courtCard) {
            document.querySelectorAll('.court-card').forEach(card => {
                card.style.border = '2px solid var(--light-gray)';
                card.style.background = 'var(--light-gray)';
            });
            
            courtCard.style.border = '2px solid var(--primary-blue)';
            courtCard.style.background = 'linear-gradient(135deg, var(--secondary-blue) 0%, var(--light-gray) 100%)';
            courtCard.style.boxShadow = '0 5px 25px var(--glow-blue)';
            
            selectedCourt = courtCard.dataset.court;
            document.getElementById('selectedCourt').value = selectedCourt;
        }

        // Update day
        resDateInput.addEventListener('change', function() {
            const selectedDate = new Date(this.value);
            const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
            document.getElementById('day').value = days[selectedDate.getDay()];
            calculatePrice();
        });

        // Time slot selection
        let selectedSlot = null;
        function selectTimeSlot(slot) {
            if (selectedSlot) {
                selectedSlot.style.background = 'var(--light-gray)';
                selectedSlot.style.border = '2px solid var(--light-gray)';
                selectedSlot.style.color = 'var(--white)';
            }
            slot.style.background = 'var(--primary-blue)';
            slot.style.border = '2px solid var(--primary-blue)';
            slot.style.color = 'var(--white)';
            slot.style.boxShadow = '0 5px 20px var(--glow-blue)';
            selectedSlot = slot;
            document.getElementById('selectedTime').value = slot.dataset.time;
            calculatePrice();
        }

        // Calculate price
        document.getElementById('duration').addEventListener('change', calculatePrice);

        function calculatePrice() {
            const date = document.getElementById('date').value;
            const time = document.getElementById('selectedTime').value;
            const duration = parseInt(document.getElementById('duration').value) || 0;

            if (!date || !time || !duration) {
                resetPrice();
                return;
            }

            const selectedDate = new Date(date);
            const dayOfWeek = selectedDate.getDay();
            const hour = parseInt(time.split(':')[0]);

            let pricePerHour = 0;
            let isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);

            if (isWeekend) {
                pricePerHour = pricing.weekend;
            } else {
                if (hour >= 8 && hour < 15) {
                    pricePerHour = pricing.weekdayMorning;
                } else {
                    pricePerHour = pricing.weekdayEvening;
                }
            }

            let subtotal = pricePerHour * duration;
            let discount = 0;

            const isWeekday = !isWeekend && (dayOfWeek >= 1 && dayOfWeek <= 4);
            const isHappyHour = isWeekday && (hour >= happyHourStart && hour < happyHourEnd);
            
            if (isHappyHour) {
                discount = subtotal * happyHourDiscount;
            }

            const total = subtotal - discount;

            document.getElementById('pricePerHour').textContent = formatCurrency(pricePerHour);
            document.getElementById('durationDisplay').textContent = duration + ' Jam';
            document.getElementById('subtotal').textContent = formatCurrency(subtotal);
            document.getElementById('discount').textContent = discount > 0 ? '- ' + formatCurrency(discount) : 'Rp 0';
            document.getElementById('totalPrice').textContent = formatCurrency(total);

            if (isHappyHour) {
                document.getElementById('discount').innerHTML = `- ${formatCurrency(discount)} <span style="font-size: 0.8rem;">(Happy Hour 20% 🔥)</span>`;
            }
        }

        function resetPrice() {
            document.getElementById('pricePerHour').textContent = 'Rp 0';
            document.getElementById('durationDisplay').textContent = '0 Jam';
            document.getElementById('subtotal').textContent = 'Rp 0';
            document.getElementById('discount').textContent = 'Rp 0';
            document.getElementById('totalPrice').textContent = 'Rp 0';
        }

        function formatCurrency(amount) {
            return 'Rp ' + amount.toLocaleString('id-ID');
        }

        // Form submission
        document.getElementById('reservationForm').addEventListener('submit', function(e) {
            e.preventDefault();

            if (!document.getElementById('selectedCourt').value) {
                alert('Silakan pilih lapangan terlebih dahulu!');
                return;
            }

            if (!document.getElementById('selectedTime').value) {
                alert('Silakan pilih jam terlebih dahulu!');
                return;
            }

            const formData = {
                court: document.getElementById('selectedCourt').value,
                date: document.getElementById('date').value,
                day: document.getElementById('day').value,
                time: document.getElementById('selectedTime').value,
                duration: document.getElementById('duration').value,
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                notes: document.getElementById('notes').value,
                total: document.getElementById('totalPrice').textContent
            };

            const message = `
🏸 *RESERVASI LAPANGAN BADMINTON*
━━━━━━━━━━━━━━━━━━━

🎯 *Lapangan:* ${formData.court}

📅 *Detail Booking:*
• Tanggal: ${formData.date}
• Hari: ${formData.day}
• Jam: ${formData.time}
• Durasi: ${formData.duration} jam

👤 *Data Pemesan:*
• Nama: ${formData.name}
• Email: ${formData.email}
• No. Telp: ${formData.phone}

💰 *Total Pembayaran:*
${formData.total}

${formData.notes ? `📝 *Catatan:*\n${formData.notes}` : ''}

━━━━━━━━━━━━━━━━━━━
Mohon konfirmasi ketersediaan lapangan. Terima kasih! 🙏
            `.trim();

            const waURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
            window.open(waURL, '_blank');
            alert('Anda akan diarahkan ke WhatsApp untuk konfirmasi reservasi!');
        });

        // Phone formatting
        document.getElementById('phone').addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.startsWith('0')) {
                value = '62' + value.substring(1);
            }
            e.target.value = value.substring(0, 13);
        });
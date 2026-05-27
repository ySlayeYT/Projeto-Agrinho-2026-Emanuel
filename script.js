document.addEventListener("DOMContentLoaded", () => {
    // Seleção de Componentes e Elementos da Interface
    const calculateBtn = document.getElementById('calculateBtn');
    const iesScore = document.getElementById('iesScore');
    const waterMetric = document.getElementById('waterMetric');
    const impactMetric = document.getElementById('impactMetric');
    const energyMetric = document.getElementById('energyMetric');
    const levelMetric = document.getElementById('levelMetric');
    const recommendationList = document.getElementById('recommendationList');
    const sliders = document.querySelectorAll('.custom-slider');
    const movingBg = document.getElementById('movingBg');

    let chart;

    // --- NOVO: Efeito Parallax Interativo Guiado Pelo Mouse ---
    if (window.innerWidth > 1024) {
        document.addEventListener('mousemove', (e) => {
            const moveX = (e.clientX - window.innerWidth / 2) * 0.012;
            const moveY = (e.clientY - window.innerHeight / 2) * 0.012;
            
            // Combina a animação base do CSS com uma leve compensação de profundidade 3D do mouse
            movingBg.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.06)`;
        });
    }

    // Escuta e sincroniza os marcadores numéricos flutuantes dos sliders
    sliders.forEach(slider => {
        slider.addEventListener('input', () => {
            let valueId;
            if (slider.id === 'cropRotation') {
                valueId = 'rotationValue';
            } else {
                valueId = slider.id.replace('Usage', 'Value').replace('Energy', 'Value');
            }
            const label = document.getElementById(valueId);
            if (label) label.innerText = slider.value + '%';
        });
    });

    calculateBtn.addEventListener('click', calculateIES);

    // Efeito Odômetro de Precisão (Contagem Progressiva Suave)
    function animateCount(element, targetValue) {
        let currentValue = parseInt(element.innerText) || 0;
        const duration = 1200; // Tempo de subida elegante
        const startTime = performance.now();

        function updateNumber(currentTime) {
            const elapsedTime = currentTime - startTime;
            if (elapsedTime >= duration) {
                element.innerText = targetValue;
                return;
            }
            // Curva harmônica de desaceleração (easeOutCubic)
            const progress = elapsedTime / duration;
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const valueNow = Math.round(currentValue + (targetValue - currentValue) * easeOut);
            
            element.innerText = valueNow;
            requestAnimationFrame(updateNumber);
        }
        requestAnimationFrame(updateNumber);
    }

    function calculateIES() {
        const water = Number(document.getElementById('waterUsage').value);
        const pesticides = Number(document.getElementById('pesticideUsage').value);
        const rotation = Number(document.getElementById('cropRotation').value);
        const solar = Number(document.getElementById('solarEnergy').value);

        // Algoritmos de base estável
        const preservationScore = 65; 
        const recyclingScore = 55;

        const waterScore = water; 
        const pesticideScore = 100 - pesticides; 
        const rotationScore = rotation;
        const solarScore = solar;

        const finalIes = Math.round(
            waterScore * 0.25 +
            pesticideScore * 0.2 +
            rotationScore * 0.2 +
            solarScore * 0.15 +
            preservationScore * 0.1 +
            recyclingScore * 0.1
        );

        // Aciona reações na interface
        animateCount(iesScore, finalIes);
        updateDashboardMetrics(finalIes, waterScore, pesticideScore, solarScore);
        generateRecommendations(water, pesticides, solar);
        createHighEndChart(waterScore, pesticideScore, rotationScore, solarScore, preservationScore, recyclingScore);
    }

    function updateDashboardMetrics(ies, water, impact, energy) {
        waterMetric.innerText = water + '%';
        impactMetric.innerText = impact + '%';
        energyMetric.innerText = energy + '%';

        // Atualização tática e coloração refinada de Badges de Estado
        if (ies < 45) {
            levelMetric.innerText = 'Crítico / Baixo';
            levelMetric.style.color = '#ff4757';
            levelMetric.style.borderColor = 'rgba(255, 71, 87, 0.4)';
        } else if (ies < 75) {
            levelMetric.innerText = 'Em Transição';
            levelMetric.style.color = '#d4af37';
            levelMetric.style.borderColor = 'rgba(212, 175, 55, 0.4)';
        } else {
            levelMetric.innerText = 'Excelente / Ouro';
            levelMetric.style.color = '#2ed573';
            levelMetric.style.borderColor = 'rgba(46, 213, 115, 0.4)';
        }
    }

    function generateRecommendations(water, pesticides, solar) {
        recommendationList.innerHTML = '';
        const recommendations = [];

        if (water < 65) {
            recommendations.push('⚡ [Otimização Hídrica] Sensores detectaram eficiência abaixo da média ideal. Implemente gotejamento subterrâneo automatizado.');
        }
        if (pesticides > 45) {
            recommendations.push('🔬 [Defesa Orgânica] Carga de defensivos químicos elevada. Transicione para controle biológico com macrobióticos.');
        }
        if (solar < 50) {
            recommendations.push('☀️ [Matriz Energética] Expanda a captação fotovoltaica para zerar a pegada de carbono dos pivôs centrais.');
        }

        if (recommendations.length === 0) {
            recommendations.push('🌟 [Status Referência] Propriedade operando em níveis máximos de conformidade ESG e ecoeficiência tecnológica.');
        }

        recommendations.forEach((item, index) => {
            const li = document.createElement('li');
            li.innerText = item;
            li.style.animationDelay = `${index * 0.15}s`;
            recommendationList.appendChild(li);
        });
    }

    function createHighEndChart(water, pesticides, rotation, solar, preservation, recycling) {
        const ctx = document.getElementById('sustainabilityChart').getContext('2d');

        if (chart) {
            chart.destroy();
        }

        // Gráfico Matrix translúcido e minimalista em harmonia com o layout
        chart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Água', 'Proteção Bio', 'Rotação Solo', 'Energia Limpa', 'Preservação', 'Reciclagem'],
                datasets: [{
                    label: 'Performance %',
                    data: [water, pesticides, rotation, solar, preservation, recycling],
                    backgroundColor: 'rgba(46, 213, 115, 0.12)',
                    borderColor: '#2ed573',
                    pointBackgroundColor: '#d4af37',
                    pointBorderColor: '#ffffff',
                    pointHoverBackgroundColor: '#ffffff',
                    borderWidth: 2,
                    lineTension: 0.15
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        min: 0,
                        max: 100,
                        grid: { color: 'rgba(255, 255, 255, 0.06)' },
                        angleLines: { color: 'rgba(255, 255, 255, 0.08)' },
                        pointLabels: { 
                            color: '#cbd5e1', 
                            font: { family: 'Poppins', size: 11, weight: '500' } 
                        },
                        ticks: { display: false }
                    }
                },
                plugins: { legend: { display: false } }
            }
        });
    }

    // INTERSECTION OBSERVER: Entrada suave e orquestrada de seções durante o Scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.visual-reveal').forEach(el => observer.observe(el));

    // --- LÓGICA DA CALCULADORA DE DADOS BRUTOS ---
    const btnApplyCalc = document.getElementById('btnApplyCalc');
    
    if (btnApplyCalc) {
        btnApplyCalc.addEventListener('click', () => {
            // Função auxiliar para calcular porcentagem de forma segura
            const getPercent = (partId, totalId) => {
                const part = Number(document.getElementById(partId).value) || 0;
                const total = Number(document.getElementById(totalId).value) || 0;
                if (total === 0) return 0; // Previne divisão por zero
                
                const percent = Math.round((part / total) * 100);
                return percent > 100 ? 100 : percent; // Trava o máximo em 100%
            };

            // Captura e calcula as porcentagens
            const waterPct = getPercent('calcWaterInt', 'calcWaterTotal');
            const bioPct = getPercent('calcBio', 'calcBioTotal');
            const rotPct = getPercent('calcRotArea', 'calcRotTotal');
            const energyPct = getPercent('calcEnergyClean', 'calcEnergyTotal');

            // Atualiza os Sliders (Inputs Type Range)
            document.getElementById('waterUsage').value = waterPct;
            document.getElementById('pesticideUsage').value = bioPct;
            document.getElementById('cropRotation').value = rotPct;
            document.getElementById('solarEnergy').value = energyPct;

            // Atualiza os textos/labels ao lado dos sliders
            document.getElementById('waterValue').innerText = waterPct + '%';
            document.getElementById('pesticideValue').innerText = bioPct + '%';
            document.getElementById('rotationValue').innerText = rotPct + '%';
            document.getElementById('solarValue').innerText = energyPct + '%';

            // Executa a função nativa que já existe no seu código para recalcular todo o gráfico e notas
            calculateIES();

            // Rola a tela de forma elegante diretamente para os resultados do Dashboard
            document.getElementById('dashboard').scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }
    
    // Executa o setup padrão inicial
    calculateIES();
});
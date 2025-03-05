fetch('./data.json')
    .then((response) => response.json())
    .then((data) => {
        const main = document.querySelector('main');

        document.querySelectorAll('.info-card').forEach((e) => {
            e.style = 'opacity: 0;transform: translateY(20px);transition: opacity 0.5s, transform 0.5s;';
            setTimeout(() => {
                e.style.opacity = '1';
                e.style.transform = 'translateY(0)';
            }, 200);
        });

        Object.values(data).forEach((item) => {
            const cardWrapper = document.createElement('a');
            cardWrapper.href = item.link;
            cardWrapper.target = '_blank';
            cardWrapper.rel = 'noopener noreferrer';

            const card = document.createElement('div');
            card.className = 'card';
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

            const domain = new URL(item.link).hostname.replace('www.', '').split('.')[0];

            card.innerHTML = `
                <div class="top">
                    <div class="image" style="background-image: url('${item.logo}');" loading="lazy"></div>
                    <div class="title">
                        <p class="name">${item.name}</p>
                        <p class="link-type">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#fff"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z" /></svg> <span>${domain}</span>
                        </p>
                    </div>
                </div>
                <div class="desc">${item.desc}</div>
                <div class="tags">
                    ${item.tags
                        .map(
                            (tag) => `
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff"><path d="M861.26-382.59 577.41-98.74q-13.5 13.44-30.38 20.15-16.88 6.72-34.03 6.72-17.15 0-34.03-6.72-16.88-6.71-30.38-20.15L98.22-449.11q-12.44-12.43-19.39-28.94-6.96-16.5-6.96-34.71v-284.61q0-37.44 26.66-64.1 26.66-26.66 64.1-26.66h284.61q18.08 0 35.03 7.22 16.95 7.21 29.38 19.89l349.61 350.13q13.67 13.67 20.01 30.59 6.34 16.91 6.34 34.04 0 17.12-6.34 33.68t-20.01 29.99ZM513-162.87l283.37-283.37L446-797.13H162.87v283.37L513-162.87ZM262.36-638.09q24.79 0 42.17-17.35 17.38-17.35 17.38-42.14t-17.35-42.17q-17.35-17.38-42.14-17.38t-42.17 17.35q-17.38 17.35-17.38 42.14t17.35 42.17q17.35 17.38 42.14 17.38ZM480-480Z" /></svg>
                            ${tag}
                        </div>
                    `
                        )
                        .join('')}
                </div>
                <div class="tags-hidden" style="opacity: 0;">
                    ${item.tags
                        .map(
                            (tag) => `
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff"><path d="M861.26-382.59 577.41-98.74q-13.5 13.44-30.38 20.15-16.88 6.72-34.03 6.72-17.15 0-34.03-6.72-16.88-6.71-30.38-20.15L98.22-449.11q-12.44-12.43-19.39-28.94-6.96-16.5-6.96-34.71v-284.61q0-37.44 26.66-64.1 26.66-26.66 64.1-26.66h284.61q18.08 0 35.03 7.22 16.95 7.21 29.38 19.89l349.61 350.13q13.67 13.67 20.01 30.59 6.34 16.91 6.34 34.04 0 17.12-6.34 33.68t-20.01 29.99ZM513-162.87l283.37-283.37L446-797.13H162.87v283.37L513-162.87ZM262.36-638.09q24.79 0 42.17-17.35 17.38-17.35 17.38-42.14t-17.35-42.17q-17.35-17.38-42.14-17.38t-42.17 17.35q-17.38 17.35-17.38 42.14t17.35 42.17q17.35 17.38 42.14 17.38ZM480-480Z" /></svg>
                            ${tag}
                        </div>
                    `
                        )
                        .join('')}
                </div>
            `;

            cardWrapper.appendChild(card);
            main.appendChild(cardWrapper);

            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        });

        const searchInput = document.querySelector('.search input');
        const resultMessage = document.querySelector('.no-result');
        const info = document.querySelector('.info-card');

        function levenshtein(a, b) {
            const tmp = [];
            let i,
                j,
                alen = a.length,
                blen = b.length,
                ai,
                bj,
                cost;
            if (alen === 0) {
                return blen;
            }
            if (blen === 0) {
                return alen;
            }
            for (i = 0; i <= alen; i++) {
                tmp[i] = [i];
            }
            for (j = 0; j <= blen; j++) {
                tmp[0][j] = j;
            }
            for (i = 1; i <= alen; i++) {
                ai = a.charAt(i - 1);
                for (j = 1; j <= blen; j++) {
                    bj = b.charAt(j - 1);
                    cost = ai === bj ? 0 : 1;
                    tmp[i][j] = Math.min(tmp[i - 1][j - 1] + cost, Math.min(tmp[i][j - 1] + 1, tmp[i - 1][j] + 1));
                }
            }
            return tmp[alen][blen];
        }

        function jaccard(a, b) {
            const setA = new Set(a.split(' '));
            const setB = new Set(b.split(' '));
            const intersection = new Set([...setA].filter((x) => setB.has(x)));
            const union = new Set([...setA, ...setB]);
            return intersection.size / union.size;
        }

        function cosine(a, b) {
            const vectorize = (str) => {
                const words = str.split(' ');
                const wordCount = {};
                words.forEach((word) => (wordCount[word] = (wordCount[word] || 0) + 1));
                return wordCount;
            };

            const dotProduct = (vecA, vecB) => {
                let product = 0;
                for (const key in vecA) {
                    if (vecB[key]) product += vecA[key] * vecB[key];
                }
                return product;
            };

            const magnitude = (vec) => {
                return Math.sqrt(Object.values(vec).reduce((sum, val) => sum + val * val, 0));
            };

            const vecA = vectorize(a);
            const vecB = vectorize(b);
            const dotProd = dotProduct(vecA, vecB);
            const magA = magnitude(vecA);
            const magB = magnitude(vecB);

            return dotProd / (magA * magB);
        }

        function substringMatch(str, searchValue) {
            return str.includes(searchValue);
        }

        searchInput.addEventListener(
            'input',
            debounce((event) => {
                const searchValue = event.target.value.toLowerCase();
                if (searchValue.replaceAll(' ', '') == '') {
                    info.style.display = 'block';
                } else {
                    info.style.display = 'none';
                }
                let matchesFound = false;
                document.querySelectorAll('.card').forEach((card) => {
                    const name = card.querySelector('.name').textContent.toLowerCase();
                    const desc = card.querySelector('.desc').textContent.toLowerCase();

                    const nameMatch = levenshtein(name, searchValue) <= 3 || jaccard(name, searchValue) > 0.3 || cosine(name, searchValue) > 0.3 || substringMatch(name, searchValue);

                    const descMatch = levenshtein(desc, searchValue) <= 3 || jaccard(desc, searchValue) > 0.3 || cosine(desc, searchValue) > 0.3 || substringMatch(desc, searchValue);

                    if (nameMatch || descMatch) {
                        matchesFound = true;
                        card.parentElement.style.display = '';
                        card.style.opacity = '0';
                        setTimeout(() => {
                            card.style.transition = 'opacity 0.5s ease';
                            card.style.opacity = '1';
                        }, 100);
                    } else {
                        card.style.opacity = '1';
                        setTimeout(() => {
                            card.style.transition = 'opacity 0.5s ease';
                            card.style.opacity = '0';
                        }, 100);
                        card.parentElement.style.display = 'none';
                    }
                });
                resultMessage.style.display = matchesFound ? 'none' : 'flex';
            }, 500)
        );
    });

function debounce(func, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

const mbtiTypes = [
    "INTJ", "INTP", "ENTJ", "ENTP",
    "INFJ", "INFP", "ENFJ", "ENFP",
    "ISTJ", "ISFJ", "ESTJ", "ESFJ",
    "ISTP", "ISFP", "ESTP", "ESFP"
];

    const usedEvaluations = { "S": [], "A": [], "B": [], "C": [], "D": [], "E": [] };

let selectedMbti = null;
let currentInputField = null;  // 用于保存当前点击的输入框

function openMbtiSelector(inputField) {
    // 保存当前点击的输入框
    currentInputField = inputField;
    document.getElementById("mbtiOverlay").style.display = "flex";
    renderMbtiSelection();
}

function closeMbtiSelector() {
    document.getElementById("mbtiOverlay").style.display = "none";
}

function renderMbtiSelection() {
    const container = document.getElementById("mbtiSelection");
    container.innerHTML = "";

    // 创建 select-slider 容器
    const slider = document.createElement("div");
    slider.classList.add("select-slider");

    mbtiTypes.forEach(type => {
        const card = document.createElement("div");
        card.classList.add("select-card");
        card.innerHTML = `
            <img src="images/${type}.svg" onerror="this.onerror=null; this.src='images/default.svg';" alt="${type}">
            <h5>${type}</h5>
        `;
        card.onclick = function() {
            selectedMbti = type;
            // 更新当前选中的输入框的值
            currentInputField.value = selectedMbti;
            closeMbtiSelector();
        };

        slider.appendChild(card);
    });

    container.appendChild(slider);
}

function getMatchEvaluation(score) {
    let evaluations, rating;

    if (score >= 100) rating = "S";
    else if (score >= 80) rating = "A";
    else if (score >= 60) rating = "B";
    else if (score >= 40) rating = "C";
    else if (score >= 20) rating = "D";
    else rating = "E";

    const evaluationTexts = {
        "S": [
            "心有灵犀，简直是天作之合！", "默契十足，宛如灵魂伴侣！",
            "你们的关系犹如天赐礼物，完美契合！", "彼此理解无需言语，天然默契！"
            , "相处轻松，像多年好友般自在！", "无论何时何地，都能读懂彼此的想法！"
        ],
        "A": [
            "互补性强，适合长期相处！", "个性不同但能相互吸引！",
            "相似又独特，能够相互成就！", "你们的互动充满活力和创造力！",
            "你们的关系充满了可能性，值得深入探索！", "你们相互激励，共同成长！"
        ],
        "B": [
            "有一定的默契，但仍需沟通磨合！", "虽然个性有差异，但能找到平衡点！",
            "在共同兴趣上相处愉快！", "某些方面契合，但仍有需要适应的地方！",
            "你们的关系稳定，需要一点耐心！", "尊重彼此的不同，能相处融洽！",
            "你们的关系有潜力，但仍需努力经营！"
        ],
        "C": [
            "相处需要更多理解，但能成为朋友！",
            "在某些方面可能不太合拍，但不影响合作！", "你们的关系需要时间磨合！",
            "彼此的性格需要更多的适应，但仍有可能建立良好关系！", "尝试站在对方角度，会有更好的相处体验！",
            "虽然有不同的世界观，但依然能找到共同点！"
        ],
        "D": [
            "需要更多耐心来理解彼此！", "交流可能会有障碍，但仍有相处的空间！",
            "彼此差异较大，需要找到共同语言！", "互动可能有些挑战，但也可能带来新的体验！",
            "你们的思维方式不同，但可以从对方身上学习！", "有时会有分歧，但相互包容才能维持关系！",
            "虽然相性较低，但可以找到独特的相处方式！"
        ],
        "E": [
            "差异较大，可能需要更多努力才能相处融洽！", "思维方式完全不同，沟通可能有挑战！",
            "如果能够理解对方，或许能带来新体验！", "彼此的个性几乎完全相反，但也可能吸引！",
            "互动可能不太顺畅，但仍然值得尝试！", "适应彼此可能需要时间，但不代表没有可能！",
            "你们的世界观差距较大，但也能成为学习对方的机会！"
        ]
    };

    // 选择未使用的评价，避免重复
    let availableEvaluations = evaluationTexts[rating].filter(e => !usedEvaluations[rating].includes(e));
    if (availableEvaluations.length === 0) {
        // 如果当前等级的所有评价都用过了，重置已用列表
        usedEvaluations[rating] = [];
        availableEvaluations = evaluationTexts[rating];
    }

    const selectedEvaluation = availableEvaluations[Math.floor(Math.random() * availableEvaluations.length)];
    usedEvaluations[rating].push(selectedEvaluation); // 记录已使用的评价

    return selectedEvaluation;
}

function calculateRP(mbti1, mbti2) {
    if (mbti1.length !== 4 || mbti2.length !== 4) return 0;

    let score = 0;

    // I/E 一致 +20
    if (mbti1[0] === mbti2[0]) score += 20;

    // N/S 一致 +40
    if (mbti1[1] === mbti2[1]) score += 40;

    // T/F 不一致 +30
    if (mbti1[2] !== mbti2[2]) score += 30;

    // J/P 不一致 +10
    if (mbti1[3] !== mbti2[3]) score += 10;

    if (mbti1 === mbti2) score = 95;

    return parseFloat(score.toFixed(2));
}

function getRating(score) {
    if (score >= 100) return "S";
    if (score >= 80) return "A";
    if (score >= 60) return "B";
    if (score >= 40) return "C";
    if (score >= 20) return "D";
    return "E";
}

// 比较两个 MBTI，显示配对结果
function compareTwoMBTI() {
    const mbti1 = document.getElementById("mbti1").value.toUpperCase();
    const mbti2 = document.getElementById("mbti2").value.toUpperCase();
    const result = document.getElementById("compareResult");

    if (!mbtiTypes.includes(mbti1) || !mbtiTypes.includes(mbti2)) {
        result.innerHTML = "请输入有效的 MBTI 类型（如 INTJ）";
        return;
    }

    const score = calculateRP(mbti1, mbti2);
    const rating = getRating(score);
    result.innerHTML = `匹配评分：${score}（${rating} 级）`;
}

// 计算所有 MBTI 和用户输入的匹配评分，按分数排序
function calculateMatches() {

    const userMbti = document.getElementById("userMbti").value.toUpperCase();
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";

    if (!mbtiTypes.includes(userMbti)) {
        resultsDiv.innerHTML = "<p>请输入有效的 MBTI 类型（如 INTJ）</p>";
        return;
    }

    let matchScores = mbtiTypes.map(mbti => ({
        type: mbti,
        score: calculateRP(userMbti, mbti),
        rating: getRating(calculateRP(userMbti, mbti))
    }));

    matchScores.sort((a, b) => b.score - a.score);

    const categorizedResults = {
        "S": [],
        "A": [],
        "B": [],
        "C": [],
        "D": [],
        "E": []
    };

    matchScores.forEach(({ type, rating, score }) => {
        categorizedResults[rating].push({ type, score });
    });

    let resultHTML = "";
    for (const rating in categorizedResults) {
        if (categorizedResults[rating].length > 0) {
            resultHTML += `<h4 class="rating">${rating} 级：</h4>`;
            resultHTML += `<div class="match-slider">`;

            categorizedResults[rating].forEach(({ type, score }) => {
                // 使用SVG图片路径
                const imagePath = `images/${type}.svg`;

                resultHTML += `
                    <div class="match-card" onclick="flipCard(this)">
                        <div class="card-inner">
                            <div class="card-front">
                                <img src="${imagePath}" onerror="this.onerror=null; this.src='images/default.svg';" 
                                     alt="${type}" style="width: 80px; height: 80px; margin-bottom: 10px;">
                                <h5>${type}</h5>
                                <p>评分：${score}</p>
                            </div>
                            <div class="card-back">
                                <p>${getMatchEvaluation(score)}</p>
                                    <a href="ai_report.html?user_mbti=${userMbti}&match_mbti=${type}">
                                    获取详细报告
                                    </a>
                            </div>
                        </div>
                    </div>
                `;
            });

            resultHTML += `</div>`;
        }
    }

    resultsDiv.innerHTML = resultHTML;
}

function flipCard(card) {
    card.classList.toggle("flipped");
}
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("matchButton").addEventListener("click", calculateMatches);
});
document.addEventListener('DOMContentLoaded', () => {
    const addQuestionButton = document.getElementById('add-question');
    const questionsContainer = document.getElementById('questions-container');

    let questionCount = 0;

    addQuestionButton.addEventListener('click', () => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question';

        questionDiv.innerHTML = `
        <label for="question${questionCount}">Question ${questionCount + 1}:</label>
        <input type="text" id="question${questionCount}" name="questions[${questionCount}][question]" required>
  
        <label>Options:</label>
        <input type="text" name="questions[${questionCount}][options][0]" placeholder="Option 1" required>
        <input type="text" name="questions[${questionCount}][options][1]" placeholder="Option 2" required>
        <input type="text" name="questions[${questionCount}][options][2]" placeholder="Option 3" required>
        <input type="text" name="questions[${questionCount}][options][3]" placeholder="Option 4" required>
  
        <label for="correctOption${questionCount}">Correct Option Index:</label>
        <select name="questions[${questionCount}][correctOption]" id="correctOption${questionCount}" required>
          <option value="0">Option 1</option>
          <option value="1">Option 2</option>
          <option value="2">Option 3</option>
          <option value="3">Option 4</option>
        </select>
      `;

        questionsContainer.appendChild(questionDiv);
        questionCount++;
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const quizData = {
            quizName: formData.get('quizName'),
            creatorName: formData.get('creatorName'),
            questions: [],
        };

        for (let i = 0; i < questionCount; i++) {
            // ... (same as before)
        }

        // Send the JSON data using AJAX
        fetch('/create-quiz', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(quizData),
        })
            .then(response => response.text())
            .then(result => {
                if (response.ok) {
                    alert('Quiz created successfully!');
                } else {
                    alert('Failed to create quiz. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error creating quiz:', error);
                alert('An error occurred. Please try again.');
            });
    });
});

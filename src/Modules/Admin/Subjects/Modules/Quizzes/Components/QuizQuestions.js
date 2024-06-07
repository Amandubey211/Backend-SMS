const QuizQuestions = () => (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Quiz Questions</h2>
      {/* Add your quiz questions here */}
      <div className="mt-8">
        <div>
          <h3 className="text-xl font-semibold">What is Your Workplace?</h3>
          <div className="mt-4">
            <div>
              <input type="radio" id="option1" name="question1" />
              <label htmlFor="option1" className="ml-2">A place where question my authority</label>
            </div>
            <div className="mt-2">
              <input type="radio" id="option2" name="question1" />
              <label htmlFor="option2" className="ml-2">A place where everyone knows</label>
            </div>
            <div className="mt-2">
              <input type="radio" id="option3" name="question1" />
              <label htmlFor="option3" className="ml-2">here ever my best friends are,</label>
            </div>
            <div className="mt-2">
              <input type="radio" id="option4" name="question1" />
              <label htmlFor="option4" className="ml-2">A place where I’m the CEO</label>
            </div>
          </div>
        </div>
      </div>
      {/* Add more questions as needed */}
    </div>
  );

  export default QuizQuestions
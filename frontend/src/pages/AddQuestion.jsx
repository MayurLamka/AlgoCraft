import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";

function AddQuestion() {

    const navigate = useNavigate();

    /* =========================================
       BASIC QUESTION
    ========================================= */

    const [title, setTitle] = useState("");
    const [difficulty, setDifficulty] = useState("Easy");
    const [description, setDescription] = useState("");
    const [youtubeLink, setYoutubeLink] = useState("");

    /* =========================================
       TOPICS
    ========================================= */

    const [topics, setTopics] = useState([]);
    const [selectedTopics, setSelectedTopics] = useState([]);

    /* =========================================
       CONSTRAINTS
    ========================================= */

    const [constraints, setConstraints] = useState([
        ""
    ]);

    /* =========================================
       EXAMPLES
    ========================================= */

    const [examples, setExamples] = useState([
        {
            input: "",
            execution_input: "",
            output: "",
            explanation: ""
        }
    ]);

    /* =========================================
       HINTS
    ========================================= */

    const [hints, setHints] = useState([
        ""
    ]);

    /* =========================================
       TEST CASES
    ========================================= */

    const [testCases, setTestCases] = useState([
        {
            input_data: "",
            expected_output: "",
            is_hidden: false
        }
    ]);

    /* =========================================
       CODE TEMPLATES
    ========================================= */

    const [templates, setTemplates] = useState({
        cpp: "",
        java: "",
        python: "",
        javascript: ""
    });

    /* =========================================
       SOLUTIONS
    ========================================= */

    const [solution, setSolution] = useState({
        approach: "",
        explanation: "",
        time_complexity: "",
        space_complexity: "",

        cpp: "",
        java: "",
        python: "",
        javascript: ""
    });

    /* =========================================
       UI STATE
    ========================================= */

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    /* =========================================
       FETCH TOPICS
    ========================================= */

    useEffect(() => {

        const fetchTopics = async () => {

            try {

                const token =
                    localStorage.getItem("token");

                const response = await fetch(
                    "http://localhost:5000/api/topics",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

                const data =
                    await response.json();


                if (!response.ok || !data.success) {
                    throw new Error(
                        data.message ||
                        "Failed to load topics"
                    );
                }

                setTopics(data.topics || []);

            } catch (error) {

                console.error(
                    "Fetch topics error:",
                    error
                );

            }

        };

        fetchTopics();

    }, []);

    /* =========================================
       TOPIC SELECT
    ========================================= */

    const toggleTopic = (topicId) => {

        setSelectedTopics((previous) => {

            if (previous.includes(topicId)) {

                return previous.filter(
                    (id) => id !== topicId
                );

            }

            return [
                ...previous,
                topicId
            ];

        });

    };

    /* =========================================
       CONSTRAINTS
    ========================================= */

    const addConstraint = () => {

        setConstraints([
            ...constraints,
            ""
        ]);

    };

    const removeConstraint = (index) => {

        setConstraints(
            constraints.filter(
                (_, i) => i !== index
            )
        );

    };

    const updateConstraint = (
        index,
        value
    ) => {

        const updated = [
            ...constraints
        ];

        updated[index] = value;

        setConstraints(updated);

    };

    /* =========================================
       EXAMPLES
    ========================================= */

    const addExample = () => {

        setExamples([
            ...examples,
            {
                input: "",
                execution_input: "",
                output: "",
                explanation: ""
            }
        ]);

    };

    const removeExample = (index) => {

        if (examples.length === 1) {
            return;
        }

        setExamples(
            examples.filter(
                (_, i) => i !== index
            )
        );

    };

    const updateExample = (
        index,
        field,
        value
    ) => {

        const updated = [
            ...examples
        ];

        updated[index] = {
            ...updated[index],
            [field]: value
        };

        setExamples(updated);

    };

    /* =========================================
       HINTS
    ========================================= */

    const addHint = () => {

        setHints([
            ...hints,
            ""
        ]);

    };

    const removeHint = (index) => {

        if (hints.length === 1) {
            return;
        }

        setHints(
            hints.filter(
                (_, i) => i !== index
            )
        );

    };

    const updateHint = (
        index,
        value
    ) => {

        const updated = [
            ...hints
        ];

        updated[index] = value;

        setHints(updated);

    };

    /* =========================================
       TEST CASES
    ========================================= */

    const addTestCase = () => {

        setTestCases([
            ...testCases,
            {
                input_data: "",
                expected_output: "",
                is_hidden: false
            }
        ]);

    };

    const removeTestCase = (index) => {

        if (testCases.length === 1) {
            return;
        }

        setTestCases(
            testCases.filter(
                (_, i) => i !== index
            )
        );

    };

    const updateTestCase = (
        index,
        field,
        value
    ) => {

        const updated = [
            ...testCases
        ];

        updated[index] = {
            ...updated[index],
            [field]: value
        };

        setTestCases(updated);

    };

    /* =========================================
       TEMPLATE
    ========================================= */

    const updateTemplate = (
        language,
        value
    ) => {

        setTemplates({
            ...templates,
            [language]: value
        });

    };

    /* =========================================
       SOLUTION
    ========================================= */

    const updateSolution = (
        field,
        value
    ) => {

        setSolution({
            ...solution,
            [field]: value
        });

    };

    /* =========================================
       VALIDATION
    ========================================= */

    const validateForm = () => {

        if (!title.trim()) {
            return "Question title is required";
        }

        if (!description.trim()) {
            return "Question description is required";
        }

        if (selectedTopics.length === 0) {
            return "Please select at least one topic";
        }

        if (
            examples.length === 0 ||
            examples.some(
                (example) =>
                    !example.input.trim() ||
                    !example.output.trim()
            )
        ) {
            return "Every example must have input and output";
        }

        if (
            testCases.length === 0 ||
            testCases.some(
                (testCase) =>
                    !testCase.input_data.trim() ||
                    !testCase.expected_output.trim()
            )
        ) {
            return "Every test case must have input and expected output";
        }

        if (!solution.approach.trim()) {
            return "Solution approach is required";
        }

        if (!solution.explanation.trim()) {
            return "Solution explanation is required";
        }

        return null;

    };

    /* =========================================
       SAVE QUESTION
    ========================================= */

    const handleSubmit = async (e) => {

        e.preventDefault();

        setSaving(true);
        setError("");
        setSuccess("");

        try {

            const token =
                localStorage.getItem("token");

            const payload = {

                title: title.trim(),

                difficulty,

                description:
                    description.trim(),

                youtube_link:
                    youtubeLink.trim() || null,

                topics:
                    selectedTopics,

                constraints:
                    constraints
                        .filter(item => item.trim() !== "")
                        .map(item => ({
                            constraint_text: item.trim()
                        })),

                examples:
                    examples
                        .filter(
                            example =>
                                example.input.trim() !== "" ||
                                example.output.trim() !== ""
                        )
                        .map(example => ({
                            input:
                                example.input.trim(),

                            execution_input:
                                example.execution_input.trim() || null,

                            output:
                                example.output.trim(),

                            explanation:
                                example.explanation.trim() || null
                        })),

                hints:
                    hints
                        .filter(item => item.trim() !== "")
                        .map(item => ({
                            hint_text: item.trim()
                        })),

                testCases:
                    testCases
                        .filter(
                            testCase =>
                                testCase.input_data.trim() !== "" ||
                                testCase.expected_output.trim() !== ""
                        )
                        .map(testCase => ({
                            input_data:
                                testCase.input_data,

                            expected_output:
                                testCase.expected_output,

                            is_hidden:
                                testCase.is_hidden
                        })),

                templates: {
                    cpp: templates.cpp,
                    java: templates.java,
                    python: templates.python,
                    javascript: templates.javascript
                },

                solution: {

                    approach:
                        solution.approach.trim(),

                    explanation:
                        solution.explanation.trim(),

                    time_complexity:
                        solution.time_complexity.trim(),

                    space_complexity:
                        solution.space_complexity.trim(),

                    cpp:
                        solution.cpp,

                    java:
                        solution.java,

                    python:
                        solution.python,

                    javascript:
                        solution.javascript
                }
            };


            console.log(
                "ADD QUESTION PAYLOAD:",
                payload
            );


            const response = await fetch(
                "http://localhost:5000/api/admin/questions",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`
                    },

                    body:
                        JSON.stringify(payload)
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to create question"
                );

            }


            console.log(
                "QUESTION CREATED:",
                data
            );


            setSuccess(
                `Question created successfully! ID: ${data.question_id}`
            );


            // Optional: clear form
            // resetForm();


        } catch (error) {

            console.error(
                "ADD QUESTION ERROR:",
                error
            );

            setError(
                error.message ||
                "Something went wrong"
            );

        } finally {

            setSaving(false);

        }

    };

    return (

        <PageLayout activePage="add-question">

            <div className="admin-page">

                <div className="admin-page-header">

                    <div>

                        <h1>
                            Add Question
                        </h1>

                        <p>
                            Create a complete DSA question
                        </p>

                    </div>

                    

                </div>


                {error && (

                    <div className="admin-alert admin-alert-error">
                        {error}
                    </div>

                )}


                {success && (

                    <div className="admin-alert admin-alert-success">
                        {success}
                    </div>

                )}


                <form
                    className="admin-question-form"
                    onSubmit={handleSubmit}
                >

                    {/* =====================================
                    BASIC INFORMATION
                ===================================== */}

                    <section className="admin-card">

                        <div className="admin-card-title">
                            <span>01</span>
                            Basic Information
                        </div>

                        <div className="admin-form-group">

                            <label>
                                Question Title *
                            </label>

                            <input
                                type="text"
                                value={title}
                                onChange={(e) =>
                                    setTitle(e.target.value)
                                }
                                placeholder="Enter question title"
                            />

                        </div>


                        <div className="admin-form-row">

                            <div className="admin-form-group">

                                <label>
                                    Difficulty *
                                </label>

                                <select
                                    value={difficulty}
                                    onChange={(e) =>
                                        setDifficulty(
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="Easy">
                                        Easy
                                    </option>

                                    <option value="Medium">
                                        Medium
                                    </option>

                                    <option value="Hard">
                                        Hard
                                    </option>

                                </select>

                            </div>


                            <div className="admin-form-group">

                                <label>
                                    YouTube Link
                                </label>

                                <input
                                    type="url"
                                    value={youtubeLink}
                                    onChange={(e) =>
                                        setYoutubeLink(
                                            e.target.value
                                        )
                                    }
                                    placeholder="https://youtube.com/..."
                                />

                            </div>

                        </div>


                        <div className="admin-form-group">

                            <label>
                                Topics *
                            </label>

                            <div className="admin-topic-list">


                                {topics.map((topic) => (
                                    <button
                                        key={topic.topic_id}
                                        type="button"
                                        className={`admin-topic ${selectedTopics.includes(topic.topic_id)
                                            ? "selected"
                                            : ""
                                            }`}
                                        onClick={() => toggleTopic(topic.topic_id)}
                                    >
                                        {topic.topic_name}
                                    </button>
                                ))}
                            </div>

                        </div>


                        <div className="admin-form-group">

                            <label>
                                Description *
                            </label>

                            <textarea
                                rows="8"
                                value={description}
                                onChange={(e) =>
                                    setDescription(
                                        e.target.value
                                    )
                                }
                                placeholder="Write the complete problem description..."
                            />

                        </div>

                    </section>


                    {/* =====================================
                    CONSTRAINTS
                ===================================== */}

                    <section className="admin-card">

                        <div className="admin-card-title">
                            <span>02</span>
                            Constraints
                        </div>

                        {constraints.map(
                            (constraint, index) => (

                                <div
                                    className="admin-dynamic-row"
                                    key={index}
                                >

                                    <span className="admin-number">
                                        {index + 1}
                                    </span>

                                    <input
                                        type="text"
                                        value={constraint}
                                        onChange={(e) =>
                                            updateConstraint(
                                                index,
                                                e.target.value
                                            )
                                        }
                                        placeholder="Example: 1 <= nums.length <= 10^4"
                                    />

                                    <button
                                        type="button"
                                        className="admin-remove-button"
                                        onClick={() =>
                                            removeConstraint(
                                                index
                                            )
                                        }
                                    >
                                        ×
                                    </button>

                                </div>

                            )
                        )}

                        <button
                            type="button"
                            className="admin-add-button"
                            onClick={addConstraint}
                        >
                            + Add Constraint
                        </button>

                    </section>


                    {/* =====================================
                    EXAMPLES
                ===================================== */}

                    <section className="admin-card">

                        <div className="admin-card-title">
                            <span>03</span>
                            Examples
                        </div>

                        {examples.map(
                            (example, index) => (

                                <div
                                    className="admin-example-card"
                                    key={index}
                                >

                                    <div className="admin-section-row">

                                        <h3>
                                            Example {index + 1}
                                        </h3>

                                        <button
                                            type="button"
                                            className="admin-remove-text"
                                            onClick={() =>
                                                removeExample(
                                                    index
                                                )
                                            }
                                        >
                                            Remove
                                        </button>

                                    </div>


                                    <div className="admin-form-group">

                                        <label>
                                            Display Input *
                                        </label>

                                        <textarea
                                            rows="3"
                                            value={example.input}
                                            onChange={(e) =>
                                                updateExample(
                                                    index,
                                                    "input",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Example: nums = [2,7,11,15], target = 9"
                                        />

                                    </div>


                                    <div className="admin-form-group">

                                        <label>
                                            Execution Input
                                        </label>

                                        <textarea
                                            rows="3"
                                            value={
                                                example.execution_input
                                            }
                                            onChange={(e) =>
                                                updateExample(
                                                    index,
                                                    "execution_input",
                                                    e.target.value
                                                )
                                            }
                                            placeholder={"Example:\n4\n2 7 11 15\n9"}
                                        />

                                        <small>
                                            Actual stdin sent to the program.
                                        </small>

                                    </div>


                                    <div className="admin-form-group">

                                        <label>
                                            Output *
                                        </label>

                                        <textarea
                                            rows="3"
                                            value={example.output}
                                            onChange={(e) =>
                                                updateExample(
                                                    index,
                                                    "output",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Example: [0,1]"
                                        />

                                    </div>


                                    <div className="admin-form-group">

                                        <label>
                                            Explanation
                                        </label>

                                        <textarea
                                            rows="3"
                                            value={
                                                example.explanation
                                            }
                                            onChange={(e) =>
                                                updateExample(
                                                    index,
                                                    "explanation",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Explain why this output is correct..."
                                        />

                                    </div>

                                </div>

                            )
                        )}

                        <button
                            type="button"
                            className="admin-add-button"
                            onClick={addExample}
                        >
                            + Add Example
                        </button>

                    </section>


                    {/* =====================================
                    HINTS
                ===================================== */}

                    <section className="admin-card">

                        <div className="admin-card-title">
                            <span>04</span>
                            Hints
                        </div>

                        {hints.map(
                            (hint, index) => (

                                <div
                                    className="admin-dynamic-row"
                                    key={index}
                                >

                                    <span className="admin-number">
                                        {index + 1}
                                    </span>

                                    <textarea
                                        rows="2"
                                        value={hint}
                                        onChange={(e) =>
                                            updateHint(
                                                index,
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter hint..."
                                    />

                                    <button
                                        type="button"
                                        className="admin-remove-button"
                                        onClick={() =>
                                            removeHint(
                                                index
                                            )
                                        }
                                    >
                                        ×
                                    </button>

                                </div>

                            )
                        )}

                        <button
                            type="button"
                            className="admin-add-button"
                            onClick={addHint}
                        >
                            + Add Hint
                        </button>

                    </section>


                    {/* =====================================
                    TEST CASES
                ===================================== */}

                    <section className="admin-card">

                        <div className="admin-card-title">
                            <span>05</span>
                            Test Cases
                        </div>

                        {testCases.map(
                            (testCase, index) => (

                                <div
                                    className="admin-example-card"
                                    key={index}
                                >

                                    <div className="admin-section-row">

                                        <h3>
                                            Test Case {index + 1}
                                        </h3>

                                        <button
                                            type="button"
                                            className="admin-remove-text"
                                            onClick={() =>
                                                removeTestCase(
                                                    index
                                                )
                                            }
                                        >
                                            Remove
                                        </button>

                                    </div>


                                    <div className="admin-form-group">

                                        <label>
                                            Input *
                                        </label>

                                        <textarea
                                            rows="4"
                                            value={
                                                testCase.input_data
                                            }
                                            onChange={(e) =>
                                                updateTestCase(
                                                    index,
                                                    "input_data",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Actual input given to the program"
                                        />

                                    </div>


                                    <div className="admin-form-group">

                                        <label>
                                            Expected Output *
                                        </label>

                                        <textarea
                                            rows="3"
                                            value={
                                                testCase.expected_output
                                            }
                                            onChange={(e) =>
                                                updateTestCase(
                                                    index,
                                                    "expected_output",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Expected program output"
                                        />

                                    </div>


                                    <label className="admin-checkbox">

                                        <input
                                            type="checkbox"
                                            checked={
                                                testCase.is_hidden
                                            }
                                            onChange={(e) =>
                                                updateTestCase(
                                                    index,
                                                    "is_hidden",
                                                    e.target.checked
                                                )
                                            }
                                        />

                                        Hidden Test Case

                                    </label>

                                </div>

                            )
                        )}

                        <button
                            type="button"
                            className="admin-add-button"
                            onClick={addTestCase}
                        >
                            + Add Test Case
                        </button>

                    </section>


                    {/* =====================================
                    CODE TEMPLATES
                ===================================== */}

                    <section className="admin-card">

                        <div className="admin-card-title">
                            <span>06</span>
                            Code Templates
                        </div>

                        {[
                            ["cpp", "C++"],
                            ["java", "Java"],
                            ["python", "Python"],
                            ["javascript", "JavaScript"]
                        ].map(
                            ([key, label]) => (

                                <div
                                    className="admin-form-group"
                                    key={key}
                                >

                                    <label>
                                        {label}
                                    </label>

                                    <textarea
                                        className="admin-code-textarea"
                                        rows="12"
                                        value={
                                            templates[key]
                                        }
                                        onChange={(e) =>
                                            updateTemplate(
                                                key,
                                                e.target.value
                                            )
                                        }
                                        placeholder={`Enter ${label} starter code...`}
                                    />

                                </div>

                            )
                        )}

                    </section>


                    {/* =====================================
                    SOLUTION
                ===================================== */}

                    <section className="admin-card">

                        <div className="admin-card-title">
                            <span>07</span>
                            Official Solution
                        </div>

                        <div className="admin-form-group">

                            <label>
                                Approach *
                            </label>

                            <textarea
                                rows="5"
                                value={
                                    solution.approach
                                }
                                onChange={(e) =>
                                    updateSolution(
                                        "approach",
                                        e.target.value
                                    )
                                }
                                placeholder="Explain the main idea of the solution..."
                            />

                        </div>


                        <div className="admin-form-group">

                            <label>
                                Explanation *
                            </label>

                            <textarea
                                rows="8"
                                value={
                                    solution.explanation
                                }
                                onChange={(e) =>
                                    updateSolution(
                                        "explanation",
                                        e.target.value
                                    )
                                }
                                placeholder="Explain the solution step by step..."
                            />

                        </div>


                        <div className="admin-form-row">

                            <div className="admin-form-group">

                                <label>
                                    Time Complexity
                                </label>

                                <input
                                    type="text"
                                    value={
                                        solution.time_complexity
                                    }
                                    onChange={(e) =>
                                        updateSolution(
                                            "time_complexity",
                                            e.target.value
                                        )
                                    }
                                    placeholder="O(n)"
                                />

                            </div>


                            <div className="admin-form-group">

                                <label>
                                    Space Complexity
                                </label>

                                <input
                                    type="text"
                                    value={
                                        solution.space_complexity
                                    }
                                    onChange={(e) =>
                                        updateSolution(
                                            "space_complexity",
                                            e.target.value
                                        )
                                    }
                                    placeholder="O(n)"
                                />

                            </div>

                        </div>


                        {[
                            ["cpp", "C++"],
                            ["java", "Java"],
                            ["python", "Python"],
                            ["javascript", "JavaScript"]
                        ].map(
                            ([key, label]) => (

                                <div
                                    className="admin-form-group"
                                    key={key}
                                >

                                    <label>
                                        {label} Solution
                                    </label>

                                    <textarea
                                        className="admin-code-textarea"
                                        rows="14"
                                        value={
                                            solution[key]
                                        }
                                        onChange={(e) =>
                                            updateSolution(
                                                key,
                                                e.target.value
                                            )
                                        }
                                        placeholder={`Enter official ${label} solution...`}
                                    />

                                </div>

                            )
                        )}

                    </section>


                    {/* =====================================
                    SAVE
                ===================================== */}

                    <div className="admin-submit-area">

                        <button
                            type="button"
                            className="admin-cancel-button"
                            onClick={() =>
                                navigate("/admin/questions")
                            }
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="admin-save-button"
                            disabled={saving}
                        >

                            {saving
                                ? "Saving..."
                                : "Save Question"}

                        </button>

                    </div>

                    <div className="admin-save-area">

                        {error && (
                            <div className="admin-error">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="admin-success">
                                {success}
                            </div>
                        )}

                        {/* <button
        type="submit"
        className="admin-save-button"
        disabled={saving}
    >
        {saving
            ? "Saving..."
            : "Save Question"}
    </button> */}

                    </div>

                </form>

            </div>

        </PageLayout>
    );
}

export default AddQuestion;
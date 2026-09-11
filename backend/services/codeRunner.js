const { spawn } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");


// =====================================================
// COMMON DOCKER EXECUTION
// =====================================================

const executeDocker = (args) => {

    return new Promise((resolve) => {

        const docker = spawn(
            "docker",
            args
        );

        let stdout = "";
        let stderr = "";

        let finished = false;

        docker.stdout.on(
            "data",
            (data) => {
                stdout += data.toString();
            }
        );

        docker.stderr.on(
            "data",
            (data) => {
                stderr += data.toString();
            }
        );

        const timer = setTimeout(() => {

            if (finished) {
                return;
            }

            finished = true;

            docker.kill("SIGKILL");

            resolve({
                success: false,
                status: "Time Limit Exceeded",
                output: stdout,
                error: "Execution timed out"
            });

        }, 50000);


        docker.on(
            "close",
            (exitCode) => {

                if (finished) {
                    return;
                }

                finished = true;

                clearTimeout(timer);


                if (exitCode === 124) {

                    resolve({
                        success: false,
                        status: "Time Limit Exceeded",
                        output: stdout,
                        error: "Execution timed out"
                    });

                    return;
                }


                if (exitCode === 0) {

                    resolve({
                        success: true,
                        status: "Success",
                        output: stdout,
                        error: stderr
                    });

                    return;
                }


                resolve({
                    success: false,
                    status: "Runtime Error",
                    output: stdout,
                    error: stderr
                });

            }
        );


        docker.on(
            "error",
            (error) => {

                if (finished) {
                    return;
                }

                finished = true;

                clearTimeout(timer);

                resolve({
                    success: false,
                    status: "Docker Error",
                    output: "",
                    error: error.message
                });

            }
        );

    });

};


// =====================================================
// COMMON DIRECTORY CLEANUP
// =====================================================

const removeDirectory = async (
    directory
) => {

    try {

        await fs.promises.rm(
            directory,
            {
                recursive: true,
                force: true
            }
        );

    } catch (error) {

        console.error(
            "Cleanup error:",
            error
        );

    }

};


// =====================================================
// C++
// =====================================================

const runCpp = async (
    code,
    input = ""
) => {

    const tempDir =
        await fs.promises.mkdtemp(
            path.join(
                os.tmpdir(),
                "algocraft-cpp-run-"
            )
        );

    try {

        await fs.promises.writeFile(
            path.join(
                tempDir,
                "main.cpp"
            ),
            code,
            "utf8"
        );

        await fs.promises.writeFile(
            path.join(
                tempDir,
                "input.txt"
            ),
            input,
            "utf8"
        );


        const args = [

            "run",
            "--rm",

            "--network",
            "none",

            "--cap-drop",
            "ALL",

            "--security-opt",
            "no-new-privileges",

            "--memory",
            "256m",

            "--cpus",
            "1",

            "--pids-limit",
            "64",

            "--read-only",

            "--tmpfs",
            "/tmp:rw,nosuid,nodev,exec",

            "--mount",
            `type=bind,source=${tempDir},target=/workspace,readonly`,

            "gcc:14",

            "sh",
            "-c",

            "g++ -std=c++17 -O2 /workspace/main.cpp -o /tmp/program && timeout 3s /tmp/program < /workspace/input.txt"

        ];


        return await executeDocker(args);

    } finally {

        await removeDirectory(
            tempDir
        );

    }

};

// =====================================================
// JAVA
// =====================================================

const runJava = async (
    code,
    input = ""
) => {

    const tempDir =
        await fs.promises.mkdtemp(
            path.join(
                os.tmpdir(),
                "algocraft-java-run-"
            )
        );

    try {

        await fs.promises.writeFile(
            path.join(
                tempDir,
                "Main.java"
            ),
            code,
            "utf8"
        );

        await fs.promises.writeFile(
            path.join(
                tempDir,
                "input.txt"
            ),
            input,
            "utf8"
        );


        const args = [

            "run",
            "--rm",

            "--network",
            "none",

            "--cap-drop",
            "ALL",

            "--security-opt",
            "no-new-privileges",

            "--memory",
            "256m",

            "--cpus",
            "1",

            "--pids-limit",
            "64",

            "--read-only",

            "--tmpfs",
            "/tmp:rw,nosuid,nodev,exec",

            "--mount",
            `type=bind,source=${tempDir},target=/workspace,readonly`,

            "eclipse-temurin:17",

            "sh",
            "-c",

            "javac -d /tmp /workspace/Main.java && timeout 3s java -cp /tmp Main < /workspace/input.txt"

        ];


        return await executeDocker(args);

    } finally {

        await removeDirectory(
            tempDir
        );

    }

};


// =====================================================
// PYTHON
// =====================================================

const runPython = async (
    code,
    input = ""
) => {

    const tempDir =
        await fs.promises.mkdtemp(
            path.join(
                os.tmpdir(),
                "algocraft-python-run-"
            )
        );

    try {

        await fs.promises.writeFile(
            path.join(
                tempDir,
                "main.py"
            ),
            code,
            "utf8"
        );

        await fs.promises.writeFile(
            path.join(
                tempDir,
                "input.txt"
            ),
            input,
            "utf8"
        );


        const args = [

            "run",
            "--rm",

            "--network",
            "none",

            "--cap-drop",
            "ALL",

            "--security-opt",
            "no-new-privileges",

            "--memory",
            "256m",

            "--cpus",
            "1",

            "--pids-limit",
            "64",

            "--read-only",

            "--tmpfs",
            "/tmp:rw,nosuid,nodev,exec",

            "--mount",
            `type=bind,source=${tempDir},target=/workspace,readonly`,

            "python:3.12",

            "sh",
            "-c",

            "timeout 3s python /workspace/main.py < /workspace/input.txt"

        ];


        return await executeDocker(args);

    } finally {

        await removeDirectory(
            tempDir
        );

    }

};


// =====================================================
// JAVASCRIPT
// =====================================================

const runJavaScript = async (
    code,
    input = ""
) => {

    const tempDir =
        await fs.promises.mkdtemp(
            path.join(
                os.tmpdir(),
                "algocraft-js-run-"
            )
        );

    try {

        await fs.promises.writeFile(
            path.join(
                tempDir,
                "main.js"
            ),
            code,
            "utf8"
        );

        await fs.promises.writeFile(
            path.join(
                tempDir,
                "input.txt"
            ),
            input,
            "utf8"
        );


        const args = [

            "run",
            "--rm",

            "--network",
            "none",

            "--cap-drop",
            "ALL",

            "--security-opt",
            "no-new-privileges",

            "--memory",
            "256m",

            "--cpus",
            "1",

            "--pids-limit",
            "64",

            "--read-only",

            "--tmpfs",
            "/tmp:rw,nosuid,nodev,exec",

            "--mount",
            `type=bind,source=${tempDir},target=/workspace,readonly`,

            "node:22",

            "sh",
            "-c",

            "timeout 3s node /workspace/main.js < /workspace/input.txt"

        ];


        return await executeDocker(args);

    } finally {

        await removeDirectory(
            tempDir
        );

    }

};


// =====================================================
// RUN CODE BY LANGUAGE
// =====================================================

const runCodeByLanguage = async (
    language,
    code,
    input = ""
) => {

    const normalizedLanguage =
        language.toLowerCase();


    switch (normalizedLanguage) {

        case "cpp":

            return await runCpp(
                code,
                input
            );


        case "java":

            return await runJava(
                code,
                input
            );


        case "python":

            return await runPython(
                code,
                input
            );


        case "javascript":

            return await runJavaScript(
                code,
                input
            );


        default:

            return {

                success: false,

                status:
                    "Unsupported Language",

                output: "",

                error:
                    `Unsupported language: ${language}`
            };

    }

};

// =====================================================
// JUDGE C++
// =====================================================

const judgeCpp = async (
    code,
    testCases
) => {

    const tempDir =
        await fs.promises.mkdtemp(
            path.join(
                os.tmpdir(),
                "algocraft-cpp-judge-"
            )
        );

    try {

        // ---------------------------------------------
        // SAVE C++ CODE
        // ---------------------------------------------

        await fs.promises.writeFile(
            path.join(
                tempDir,
                "main.cpp"
            ),
            code,
            "utf8"
        );


        // ---------------------------------------------
        // CREATE TEST INPUT FILES
        // ---------------------------------------------

        for (
            let i = 0;
            i < testCases.length;
            i++
        ) {

            await fs.promises.writeFile(
                path.join(
                    tempDir,
                    `input_${i}.txt`
                ),
                testCases[i].input_data || "",
                "utf8"
            );
        }


        // ---------------------------------------------
        // BUILD COMMAND
        // ---------------------------------------------

        let command =
            "g++ -std=c++17 -O2 " +
            "/workspace/main.cpp " +
            "-o /tmp/program";

        command +=
            " || exit 10;";


        // ---------------------------------------------
        // RUN ALL TEST CASES
        // ---------------------------------------------

        for (
            let i = 0;
            i < testCases.length;
            i++
        ) {

            command += `

                echo "__TEST_${i}_START__";

                timeout 3s \
                /tmp/program \
                < /workspace/input_${i}.txt;

                EXIT_CODE=$?;

                echo "__TEST_${i}_END__";

                if [ $EXIT_CODE -eq 124 ]; then
                    exit 124;
                fi;

                if [ $EXIT_CODE -ne 0 ]; then
                    exit 20;
                fi;
            `;
        }


        // ---------------------------------------------
        // DOCKER
        // ---------------------------------------------

        const args = [

            "run",
            "--rm",

            "--network",
            "none",

            "--cap-drop",
            "ALL",

            "--security-opt",
            "no-new-privileges",

            "--memory",
            "256m",

            "--cpus",
            "1",

            "--pids-limit",
            "64",

            "--read-only",

            "--tmpfs",
            "/tmp:rw,nosuid,nodev,exec",

            "--mount",
            `type=bind,source=${tempDir},target=/workspace,readonly`,

            "gcc:14",

            "sh",
            "-c",

            command
        ];


        const execution =
            await executeDocker(
                args
            );


        // ---------------------------------------------
        // COMPILATION ERROR
        // ---------------------------------------------

        if (
            execution.status ===
            "Runtime Error" &&
            execution.error &&
            (
                execution.error.includes(
                    "error:"
                ) ||
                execution.error.includes(
                    "fatal error"
                )
            )
        ) {

            return {

                success: false,

                status:
                    "Compilation Error",

                output:
                    execution.output,

                error:
                    execution.error
            };
        }


        // ---------------------------------------------
        // TLE
        // ---------------------------------------------

        if (
            execution.status ===
            "Time Limit Exceeded"
        ) {

            return execution;
        }


        // ---------------------------------------------
        // RUNTIME ERROR
        // ---------------------------------------------

        if (
            execution.status ===
            "Runtime Error"
        ) {

            return {

                success: false,

                status:
                    "Runtime Error",

                output:
                    execution.output,

                error:
                    execution.error
            };
        }


        // ---------------------------------------------
        // SUCCESS
        // ---------------------------------------------

        return {

            success: true,

            status:
                "Success",

            output:
                execution.output,

            error:
                execution.error
        };


    } finally {

        await removeDirectory(
            tempDir
        );

    }

};
// =====================================================
// JUDGE JAVA
// =====================================================

const judgeJava = async (
    code,
    testCases
) => {

    const tempDir =
        await fs.promises.mkdtemp(
            path.join(
                os.tmpdir(),
                "algocraft-java-judge-"
            )
        );

    try {

        // ---------------------------------------------
        // SAVE JAVA CODE
        // ---------------------------------------------

        await fs.promises.writeFile(
            path.join(
                tempDir,
                "Main.java"
            ),
            code,
            "utf8"
        );


        // ---------------------------------------------
        // CREATE TEST INPUT FILES
        // ---------------------------------------------

        for (
            let i = 0;
            i < testCases.length;
            i++
        ) {

            await fs.promises.writeFile(
                path.join(
                    tempDir,
                    `input_${i}.txt`
                ),
                testCases[i].input_data || "",
                "utf8"
            );
        }


        // ---------------------------------------------
        // BUILD COMMAND
        // ---------------------------------------------

        let command =
            "javac -d /tmp /workspace/Main.java";

        command +=
            " || exit 10;";

        command +=
            " mkdir -p /tmp/algocraft-java-tests;";

        command +=
            " rm -f /tmp/algocraft-java-tests/*;";


        // ---------------------------------------------
        // RUN ALL TEST CASES
        // ---------------------------------------------

        for (
            let i = 0;
            i < testCases.length;
            i++
        ) {

            command += `

                echo "__TEST_${i}_START__";

                timeout 3s \
                java -cp /tmp Main \
                < /workspace/input_${i}.txt;

                EXIT_CODE=$?;

                echo "__TEST_${i}_END__";

                if [ $EXIT_CODE -eq 124 ]; then
                    exit 124;
                fi;

                if [ $EXIT_CODE -ne 0 ]; then
                    exit 20;
                fi;
            `;
        }


        const args = [

            "run",
            "--rm",

            "--network",
            "none",

            "--cap-drop",
            "ALL",

            "--security-opt",
            "no-new-privileges",

            "--memory",
            "256m",

            "--cpus",
            "1",

            "--pids-limit",
            "64",

            "--read-only",

            "--tmpfs",
            "/tmp:rw,nosuid,nodev,exec",

            "--mount",
            `type=bind,source=${tempDir},target=/workspace,readonly`,

            "eclipse-temurin:17",

            "sh",
            "-c",

            command
        ];


        const execution =
            await executeDocker(
                args
            );


        // ---------------------------------------------
        // CONVERT EXIT STATUS
        // ---------------------------------------------

        if (
            execution.success
        ) {

            return {

                success: true,

                status: "Success",

                output:
                    execution.output,

                error:
                    execution.error
            };
        }


        if (
            execution.error &&
            execution.error.includes(
                "error:"
            )
        ) {

            return {

                success: false,

                status: "Compilation Error",

                output:
                    execution.output,

                error:
                    execution.error
            };
        }


        if (
            execution.status ===
            "Time Limit Exceeded"
        ) {

            return execution;
        }


        return {

            success: false,

            status: "Runtime Error",

            output:
                execution.output,

            error:
                execution.error
        };


    } finally {

        await removeDirectory(
            tempDir
        );

    }
};


// =====================================================
// JUDGE PYTHON
// =====================================================

const judgePython = async (
    code,
    testCases
) => {

    const tempDir =
        await fs.promises.mkdtemp(
            path.join(
                os.tmpdir(),
                "algocraft-python-judge-"
            )
        );

    try {

        await fs.promises.writeFile(
            path.join(
                tempDir,
                "main.py"
            ),
            code,
            "utf8"
        );


        // ---------------------------------------------
        // CREATE TEST INPUT FILES
        // ---------------------------------------------

        for (
            let i = 0;
            i < testCases.length;
            i++
        ) {

            await fs.promises.writeFile(
                path.join(
                    tempDir,
                    `input_${i}.txt`
                ),
                testCases[i].input_data || "",
                "utf8"
            );
        }


        // ---------------------------------------------
        // CHECK SYNTAX FIRST
        // ---------------------------------------------

        let command = `
            python -m py_compile /workspace/main.py
            || exit 10;
        `;


        // ---------------------------------------------
        // RUN ALL TEST CASES
        // ---------------------------------------------

        for (
            let i = 0;
            i < testCases.length;
            i++
        ) {

            command += `

                echo "__TEST_${i}_START__";

                timeout 3s \
                python /workspace/main.py \
                < /workspace/input_${i}.txt;

                EXIT_CODE=$?;

                echo "__TEST_${i}_END__";

                if [ $EXIT_CODE -eq 124 ]; then
                    exit 124;
                fi;

                if [ $EXIT_CODE -ne 0 ]; then
                    exit 20;
                fi;
            `;
        }


        const args = [

            "run",
            "--rm",

            "--network",
            "none",

            "--cap-drop",
            "ALL",

            "--security-opt",
            "no-new-privileges",

            "--memory",
            "256m",

            "--cpus",
            "1",

            "--pids-limit",
            "64",

            "--read-only",

            "--tmpfs",
            "/tmp:rw,nosuid,nodev,exec",

            "--mount",
            `type=bind,source=${tempDir},target=/workspace,readonly`,

            "python:3.12",

            "sh",
            "-c",

            command
        ];


        const execution =
            await executeDocker(
                args
            );


        if (
            execution.success
        ) {

            return {

                success: true,

                status: "Success",

                output:
                    execution.output,

                error:
                    execution.error
            };
        }


        if (
            execution.error &&
            execution.error.includes(
                "SyntaxError"
            )
        ) {

            return {

                success: false,

                status: "Compilation Error",

                output:
                    execution.output,

                error:
                    execution.error
            };
        }


        if (
            execution.status ===
            "Time Limit Exceeded"
        ) {

            return execution;
        }


        return {

            success: false,

            status: "Runtime Error",

            output:
                execution.output,

            error:
                execution.error
        };


    } finally {

        await removeDirectory(
            tempDir
        );

    }
};


// =====================================================
// JUDGE JAVASCRIPT
// =====================================================

const judgeJavaScript = async (
    code,
    testCases
) => {

    const tempDir =
        await fs.promises.mkdtemp(
            path.join(
                os.tmpdir(),
                "algocraft-js-judge-"
            )
        );

    try {

        await fs.promises.writeFile(
            path.join(
                tempDir,
                "main.js"
            ),
            code,
            "utf8"
        );


        // ---------------------------------------------
        // CREATE TEST INPUT FILES
        // ---------------------------------------------

        for (
            let i = 0;
            i < testCases.length;
            i++
        ) {

            await fs.promises.writeFile(
                path.join(
                    tempDir,
                    `input_${i}.txt`
                ),
                testCases[i].input_data || "",
                "utf8"
            );
        }


        // ---------------------------------------------
        // CHECK + RUN
        // ---------------------------------------------

        let command = `
            node --check /workspace/main.js
            || exit 10;
        `;


        for (
            let i = 0;
            i < testCases.length;
            i++
        ) {

            command += `

                echo "__TEST_${i}_START__";

                timeout 3s \
                node /workspace/main.js \
                < /workspace/input_${i}.txt;

                EXIT_CODE=$?;

                echo "__TEST_${i}_END__";

                if [ $EXIT_CODE -eq 124 ]; then
                    exit 124;
                fi;

                if [ $EXIT_CODE -ne 0 ]; then
                    exit 20;
                fi;
            `;
        }


        const args = [

            "run",
            "--rm",

            "--network",
            "none",

            "--cap-drop",
            "ALL",

            "--security-opt",
            "no-new-privileges",

            "--memory",
            "256m",

            "--cpus",
            "1",

            "--pids-limit",
            "64",

            "--read-only",

            "--tmpfs",
            "/tmp:rw,nosuid,nodev,exec",

            "--mount",
            `type=bind,source=${tempDir},target=/workspace,readonly`,

            "node:22",

            "sh",
            "-c",

            command
        ];


        const execution =
            await executeDocker(
                args
            );


        if (
            execution.success
        ) {

            return {

                success: true,

                status: "Success",

                output:
                    execution.output,

                error:
                    execution.error
            };
        }


        if (
            execution.error &&
            execution.error.includes(
                "SyntaxError"
            )
        ) {

            return {

                success: false,

                status: "Compilation Error",

                output:
                    execution.output,

                error:
                    execution.error
            };
        }


        if (
            execution.status ===
            "Time Limit Exceeded"
        ) {

            return execution;
        }


        return {

            success: false,

            status: "Runtime Error",

            output:
                execution.output,

            error:
                execution.error
        };


    } finally {

        await removeDirectory(
            tempDir
        );

    }
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {

    runCpp,

    runJava,

    runPython,

    runJavaScript,

    runCodeByLanguage,

    judgeCpp,

    judgeJava,

    judgePython,

    judgeJavaScript

};
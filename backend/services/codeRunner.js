const { spawn } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");


// =====================================================
// RUN CODE
// =====================================================
const runCpp = async (code, input = "") => {

    const tempDir = await fs.promises.mkdtemp(
        path.join(os.tmpdir(), "algocraft-run-")
    );

    try {

        await fs.promises.writeFile(
            path.join(tempDir, "main.cpp"),
            code,
            "utf8"
        );

        await fs.promises.writeFile(
            path.join(tempDir, "input.txt"),
            input,
            "utf8"
        );

        console.log("=================================");
        console.log("RUN CPP");
        console.log("TEMP DIR:", tempDir);
        console.log("INPUT:", JSON.stringify(input));
        console.log("=================================");

        const args = [
            "run",
            "--rm",

            "--network",
            "none",

            "--mount",
            `type=bind,source=${tempDir},target=/workspace,readonly`,

            "gcc:14",

            "sh",
            "-c",

            "g++ -std=c++17 -O2 /workspace/main.cpp -o /tmp/program && /tmp/program < /workspace/input.txt"
        ];

        return await executeDocker(args);

    } catch (error) {

        return {
            success: false,
            status: "Docker Error",
            output: "",
            error: error.message
        };

    } finally {

        await removeDirectory(tempDir);
    }
};


// =====================================================
// COMPILE ONCE
// =====================================================

const compileCpp = async (code) => {

    const tempDir = await fs.promises.mkdtemp(
        path.join(os.tmpdir(), "algocraft-compile-")
    );

    const volumeName =
        `algocraft_${Date.now()}_${Math.random()
            .toString(36)
            .substring(2, 8)}`;

    try {

        await fs.promises.writeFile(
            path.join(tempDir, "main.cpp"),
            code,
            "utf8"
        );


        // Create Docker volume

        const volume =
            await executeDockerCommand([
                "volume",
                "create",
                volumeName
            ]);


        if (volume.exitCode !== 0) {

            throw new Error(
                volume.stderr ||
                "Could not create Docker volume"
            );
        }


        // Compile

        const compileArgs = [

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

            "--mount",
            `type=volume,source=${volumeName},target=/compiled`,

            "gcc:14",

            "sh",
            "-c",

            `
            g++ -std=c++17 -O2 -pipe \
                /workspace/main.cpp \
                -o /compiled/program

            chmod +x /compiled/program
            `
        ];


        const result =
            await executeDockerCommand(
                compileArgs
            );


        if (result.exitCode !== 0) {

            await removeDockerVolume(
                volumeName
            );

            return {

                success: false,

                status:
                    "Compilation Error",

                output: "",

                error:
                    result.stderr ||
                    "Compilation failed"
            };
        }


        return {

            success: true,

            status:
                "Compiled",

            volumeName
        };


    } catch (error) {

        await removeDockerVolume(
            volumeName
        );

        return {

            success: false,

            status:
                "Docker Error",

            output: "",

            error:
                error.message
        };

    } finally {

        await removeDirectory(
            tempDir
        );
    }
};


// =====================================================
// RUN COMPILED PROGRAM
// =====================================================

const runCompiledCpp = async (
    volumeName,
    input = ""
) => {

    const tempDir =
        await fs.promises.mkdtemp(
            path.join(
                os.tmpdir(),
                "algocraft-input-"
            )
        );


    const inputPath =
        path.join(
            tempDir,
            "input.txt"
        );


    try {

        // =============================================
        // IMPORTANT
        // Write EXACT test input
        // =============================================

        await fs.promises.writeFile(
            inputPath,
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

            // Compiled program
            "--mount",
            `type=volume,source=${volumeName},target=/compiled,readonly`,

            // Input
            "--mount",
            `type=bind,source=${tempDir},target=/input,readonly`,

            "gcc:14",

            "sh",
            "-c",

            `
            timeout 3s \
                /compiled/program \
                < /input/input.txt
            `
        ];


        return await executeDocker(
            args
        );


    } finally {

        await removeDirectory(
            tempDir
        );
    }
};

// =====================================================
// JUDGE CPP
// =====================================================

const judgeCpp = async (
    code,
    testCases
) => {

    // =============================================
    // 1. COMPILE ONCE
    // =============================================

    const compiled = await compileCpp(code);

    if (!compiled.success) {

        return {

            success: false,

            status:
                compiled.status,

            output: "",

            error:
                compiled.error
        };
    }


    let combinedOutput = "";


    try {

        // =============================================
        // 2. RUN EVERY TEST CASE
        // =============================================

        for (
            let i = 0;
            i < testCases.length;
            i++
        ) {

            const testCase =
                testCases[i];

            const input =
                testCase.input_data || "";


            console.log(
                "================================="
            );

            console.log(
                "RUNNING TEST CASE:",
                i + 1
            );

            console.log(
                "INPUT:",
                JSON.stringify(input)
            );

            console.log(
                "INPUT LENGTH:",
                input.length
            );

            console.log(
                "================================="
            );


            // =====================================
            // RUN COMPILED PROGRAM
            // =====================================

            const result =
                await runCompiledCpp(
                    compiled.volumeName,
                    input
                );


            // =====================================
            // HANDLE TLE
            // =====================================

            if (
                result.status ===
                "Time Limit Exceeded"
            ) {

                return {

                    success: false,

                    status:
                        "Time Limit Exceeded",

                    output:
                        combinedOutput,

                    error:
                        result.error
                };
            }


            // =====================================
            // HANDLE RUNTIME ERROR
            // =====================================

            if (
                result.status ===
                "Runtime Error"
            ) {

                return {

                    success: false,

                    status:
                        "Runtime Error",

                    output:
                        combinedOutput,

                    error:
                        result.error
                };
            }


            // =====================================
            // ADD MARKERS
            // =====================================

            combinedOutput +=
                `__TEST_${i}_START__\n`;

            combinedOutput +=
                result.output || "";

            combinedOutput +=
                `\n__TEST_${i}_END__\n`;
        }


        return {

            success: true,

            status:
                "Success",

            output:
                combinedOutput,

            error: ""
        };


    } finally {

        // =============================================
        // ALWAYS DELETE COMPILED VOLUME
        // =============================================

        await cleanupCompiledCpp(
            compiled.volumeName
        );
    }
};

// =====================================================
// CLEANUP COMPILED PROGRAM
// =====================================================

const cleanupCompiledCpp = async (
    volumeName
) => {

    await removeDockerVolume(
        volumeName
    );
};


// =====================================================
// DOCKER EXECUTION
// =====================================================

const executeDocker = (
    args
) => {

    return new Promise((resolve) => {

        const docker =
            spawn(
                "docker",
                args
            );

        let stdout = "";
        let stderr = "";

        let finished = false;


        docker.stdout.on(
            "data",
            data => {

                stdout +=
                    data.toString();
            }
        );


        docker.stderr.on(
            "data",
            data => {

                stderr +=
                    data.toString();
            }
        );


        const timer =
            setTimeout(() => {

                if (finished) {
                    return;
                }

                finished = true;

                docker.kill(
                    "SIGKILL"
                );

                resolve({

                    success: false,

                    status:
                        "Time Limit Exceeded",

                    output:
                        stdout,

                    error:
                        "Execution timed out"
                });

            }, 50000);


        docker.on(
            "close",
            exitCode => {

                if (finished) {
                    return;
                }

                finished = true;

                clearTimeout(timer);


                if (exitCode === 10) {

                    resolve({

                        success: false,

                        status:
                            "Compilation Error",

                        output:
                            stdout,

                        error:
                            stderr
                    });

                    return;
                }


                if (exitCode === 124) {

                    resolve({

                        success: false,

                        status:
                            "Time Limit Exceeded",

                        output:
                            stdout,

                        error:
                            "Execution timed out"
                    });

                    return;
                }


                if (exitCode === 0) {

                    resolve({

                        success: true,

                        status:
                            "Success",

                        output:
                            stdout,

                        error:
                            stderr
                    });

                    return;
                }


                resolve({

                    success: false,

                    status:
                        "Runtime Error",

                    output:
                        stdout,

                    error:
                        stderr
                });
            }
        );


        docker.on(
            "error",
            error => {

                if (finished) {
                    return;
                }

                finished = true;

                clearTimeout(timer);

                resolve({

                    success: false,

                    status:
                        "Docker Error",

                    output: "",

                    error:
                        error.message
                });
            }
        );
    });
};


// =====================================================
// DOCKER COMMAND
// =====================================================

const executeDockerCommand = (
    args
) => {

    return new Promise((resolve) => {

        const docker =
            spawn(
                "docker",
                args
            );
        console.log("DOCKER STARTED");
        console.log("DOCKER ARGS:", args);

        let stdout = "";
        let stderr = "";


        docker.stdout.on(
            "data",
            data => {

                stdout +=
                    data.toString();
            }
        );


        docker.stderr.on(
            "data",
            data => {

                stderr +=
                    data.toString();
            }
        );


        docker.on(
            "close",
            exitCode => {

                resolve({

                    exitCode,

                    stdout,

                    stderr
                });
            }
        );


        docker.on(
            "error",
            error => {

                resolve({

                    exitCode: -1,

                    stdout,

                    stderr:
                        error.message
                });
            }
        );
    });
};


// =====================================================
// REMOVE VOLUME
// =====================================================

const removeDockerVolume = async (
    volumeName
) => {

    if (!volumeName) {
        return;
    }

    await executeDockerCommand([
        "volume",
        "rm",
        "-f",
        volumeName
    ]);
};


// =====================================================
// REMOVE DIRECTORY
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
// EXPORT
// =====================================================

module.exports = {

    runCpp,

    compileCpp,

    runCompiledCpp,

    cleanupCompiledCpp,

    judgeCpp
};
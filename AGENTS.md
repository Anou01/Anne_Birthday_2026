# Birthday surprise project

## Continue an existing task

When resuming this project, read `docs/CURRENT_TASK.md` for the latest state,
completed work, and next steps. Read
`docs/superpowers/specs/2026-09-30-birthday-surprise-design.md` when working on
the website's design or implementation. Inspect the actual workspace before
assuming that the saved status still describes the files.

Keep `docs/CURRENT_TASK.md` current at meaningful milestones and before handing
off a session. Record what actually exists, validation results, remaining work,
and relevant user decisions. Clearly separate user requirements, proposed design
choices, and implemented behavior. Do not restart discovery or ask the user to
provide assets that are already here.

## Product and content

- Communicate with the user in Thai.
- Build a personal birthday surprise for Ani / ອານິ, dated 30.9.2026.
- Preserve the welcome → typed terminal with keyboard sounds → dimensional cake
  on a table → extinguished candle and photo reveal experience.
- Use the user's supplied cake and letter models. The user chose soft lighting
  and a dimensional pink-and-white cake, with one candle.
- Use `Name.txt`, `Bless.txt`, and `photo/` as the sources for personal content.
  Preserve Lao text and UTF-8 encoding; do not invent or rewrite the message.
- Preserve original source models, textures, and photos. Put converted or
  optimized delivery copies in a separate assets directory.
- The full design contains implementation proposals, not proof of completed work
  or blanket approval of every detail. See CURRENT_TASK for decision status.

## Windows command execution

- Run commands inside the tool's internal terminal. For `exec_command` on
  Windows, explicitly set `tty: true`; the default pipe mode has been observed
  to create a visible PowerShell console in this environment.
- Prefer `login: false` for noninteractive commands unless a shell profile is
  required by the task.
- Do not open external PowerShell, Command Prompt, or Windows Terminal windows.
- If a separate background process is necessary, use hidden launch options:
  PowerShell `Start-Process -WindowStyle Hidden`, Node child processes with
  `windowsHide: true`, or equivalent no-window options.
- Preserve normal command output, exit codes, and completion/cleanup checks.
  Do not hide failures or forcibly terminate processes to suppress windows.
- These rules apply to helper processes as well as the main command. If a tool
  still opens a window, diagnose its launch path rather than repeatedly using
  the visible mode.

## Verification and delivery

When implementing the experience, verify the full flow at desktop and mobile
sizes, keyboard/touch input, replay, sound controls, reduced motion, and the
no-microphone fallback. Report real microphone testing separately from simulated
or fallback checks. Do not claim a model has been rendered, a website works, or
a deployment exists unless it has actually been verified.

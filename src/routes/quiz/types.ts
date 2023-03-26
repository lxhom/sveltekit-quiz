// example:
// name: Test Quiz
// desc: |
//   Description (in MD). *Italic* and **Bold** and line
//   breaks and real
//   line breaks. Even ![Images](https://placehold.co/200x100?text=Images).
// questions:
// - name: You stupid
//   desc: Whats 9+10?
//   type: choice
//   answers:
//     A: 19
//     B: 20
//     C: 21
//     D: 22
//   correct: C
// - name: Markdown test
//   type: choice
//   desc: "*Mark*down is **allowed** here"
//   answers:
//     test: "*Here too!*"
//   correct: test
// - name: Multiple test (a and b)
//   type: multiple-choice
//   answers:
//     1: a
//     2: b
//     3: c
//     4: d
//   correct: [1, 2]
// - name: Text input prompt
//   type: text
//   correct: Hello World

export interface Quiz {
    name: string
    desc?: string
    questions: Question[]
}

export interface QuestionMeta {
    name?: string
    desc?: string
}

export interface Choice {
    type: 'choice'
    answers: Record<string, string>
    correct: string
}

export interface MultipleChoice {
    type: 'multiple-choice'
    answers: Record<string, string>
    correct: string[]
}

export interface Text {
    type: 'text'
    correct: string
}

export type Question = QuestionMeta & (Choice | MultipleChoice | Text)

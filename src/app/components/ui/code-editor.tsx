import { forwardRef } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { json } from '@codemirror/lang-json'
import { catppuccinMacchiato } from '@catppuccin/codemirror'
import { keymap } from '@codemirror/view'
import { Prec } from '@codemirror/state'

import { cn } from '@/lib/utils'

export interface CodeEditorProps {
  value?: string
  onChange?: (value: string) => void
  language?: 'json' | 'graphql'
  placeholder?: string
  className?: string
  readOnly?: boolean
  onSubmit?: () => void
}

const CodeEditor = forwardRef<HTMLDivElement, CodeEditorProps>(
  (
    {
      value = '',
      onChange,
      language = 'json',
      placeholder,
      className,
      readOnly = false,
      onSubmit
    },
    ref
  ) => {
    const extensions = []

    if (language === 'json' || language === 'graphql') {
      extensions.push(json())
    }

    // Add custom keymap for Cmd+Enter / Ctrl+Enter with high precedence
    if (onSubmit) {
      extensions.push(
        Prec.high(
          keymap.of([
            {
              key: 'Mod-Enter',
              run: () => {
                onSubmit()
                return true
              }
            }
          ])
        )
      )
    }

    return (
      <div
        ref={ref}
        className={cn('overflow-hidden h-full bg-transparent', className)}
      >
        <CodeMirror
          value={value}
          onChange={onChange}
          extensions={extensions}
          theme={catppuccinMacchiato}
          placeholder={placeholder}
          readOnly={readOnly}
          basicSetup={{
            lineNumbers: true,
            foldGutter: true,
            dropCursor: false,
            allowMultipleSelections: false,
            indentOnInput: true,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: true,
            highlightSelectionMatches: false,
            searchKeymap: true
          }}
          style={{
            fontSize: '12px',
            fontFamily:
              'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            height: '100%',
            backgroundColor: 'transparent'
          }}
        />
      </div>
    )
  }
)

CodeEditor.displayName = 'CodeEditor'

export { CodeEditor }

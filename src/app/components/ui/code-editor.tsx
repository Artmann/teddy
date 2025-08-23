import { forwardRef } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { json } from '@codemirror/lang-json'
import { catppuccinMacchiato } from '@catppuccin/codemirror'

import { cn } from '@/lib/utils'

export interface CodeEditorProps {
  value?: string
  onChange?: (value: string) => void
  language?: 'json' | 'graphql'
  placeholder?: string
  className?: string
  readOnly?: boolean
}

const CodeEditor = forwardRef<HTMLDivElement, CodeEditorProps>(
  (
    {
      value = '',
      onChange,
      language = 'json',
      placeholder,
      className,
      readOnly = false
    },
    ref
  ) => {
    const extensions = []

    if (language === 'json' || language === 'graphql') {
      extensions.push(json())
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

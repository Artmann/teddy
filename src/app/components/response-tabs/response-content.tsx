import { memo, type ReactElement, useEffect, useMemo, useState } from 'react'
import { codeToHtml } from 'shiki'

interface ResponseContentProps {
  content: string
  statusCode: number
}

export const ResponseContent = memo(function ResponseContent({
  content
}: ResponseContentProps): ReactElement {
  const [html, setHtml] = useState('')

  const { formattedContent, language } = useMemo(() => {
    let formatted = content
    let lang = 'plaintext'

    if (content.startsWith('[') || content.startsWith('{')) {
      lang = 'json'
      try {
        const parsed = JSON.parse(content)
        formatted = JSON.stringify(parsed, null, 2)
      } catch {
        // If JSON parsing fails, use original content
        formatted = content
      }
    } else if (content.startsWith('<')) {
      lang = 'html'
    }

    return { formattedContent: formatted, language: lang }
  }, [content])

  useEffect(
    function createHtml() {
      codeToHtml(formattedContent, {
        lang: language,
        theme: 'catppuccin-macchiato',
        transformers: [
          {
            pre(node) {
              node.properties.style =
                'background-color: transparent; white-space: pre-wrap; word-wrap: break-word; overflow-wrap: break-word; max-width: 100%;'

              return node
            },
            code(node) {
              if (!node.properties.style) {
                node.properties.style = ''
              }

              node.properties.style +=
                'white-space: pre-wrap; word-wrap: break-word; overflow-wrap: break-word;'

              return node
            }
          }
        ]
      }).then((newHtml) => {
        setHtml(newHtml)
      })
    },
    [formattedContent, language]
  )

  return (
    <div className="full relative">
      <div
        className={`
          content
          full 
          text-left
          whitespace-pre-wrap
          overflow-auto
          font-mono text-xs
          caret-gray
          tab-4
          bg-transparent
        `}
        dangerouslySetInnerHTML={{ __html: html }}
        data-testid="response-body"
      />
    </div>
  )
})

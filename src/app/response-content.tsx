import { memo, ReactElement, useEffect, useMemo, useState } from 'react'
import { codeToHtml } from 'shiki'

import { Badge } from './components/ui/badge'

interface ResponseContentProps {
  content: string
  statusCode: number
}

export const ResponseContent = memo(function ResponseContent({
  content,
  statusCode
}: ResponseContentProps): ReactElement {
  const [html, setHtml] = useState('')

  const language = useMemo(() => {
    if (content.startsWith('[') || content.startsWith('{')) {
      return 'json'
    }

    if (content.startsWith('<')) {
      return 'html'
    }

    return 'plaintext'
  }, [content])

  useEffect(
    function createHtml() {
      codeToHtml(content, {
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
    [content, language]
  )

  return (
    <div className="full relative">
      <div className="absolute top-4 right-4">
        <Badge variant="outline">{statusCode}</Badge>
      </div>

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
        px-6 py-5
        bg-transparent
      `}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
})

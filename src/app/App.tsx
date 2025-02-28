import { StrictMode, useCallback } from 'react'
import { useForm } from 'react-hook-form'

import { Form, FormControl, FormField, FormItem } from './components/ui/form'
import { Input } from './components/ui/input'
import { Button } from './components/ui/button'

interface FormData {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  url: string
}

export function App() {
  const form = useForm<FormData>({
    defaultValues: {
      method: 'GET',
      url: 'https://jsonplaceholder.typicode.com/posts/1'
    }
  })

  const handleSubmit = useCallback((data: FormData) => {
    console.log(data)
  }, [])

  return (
    <StrictMode>
      <main className="text-sm">
        <div className="flex flex-col">
          <div className="p-2">
            <Form {...form}>
              <form
                className="flex items-center gap-2"
                onSubmit={form.handleSubmit(handleSubmit)}
              >
                <div>POST</div>
                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            autoFocus={true}
                            type="url"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <Button
                    size="sm"
                    type="submit"
                  >
                    Send
                  </Button>
                </div>
              </form>
            </Form>
          </div>

          <div className="p-2 flex">
            <div>Request</div>
            <div>Response</div>
          </div>
        </div>
      </main>
    </StrictMode>
  )
}

import { screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { customRender, mockCreateSubmissionFn } from "@/test-setup"
import DataForm from "@/app/_components/data-form"

describe("DataForm", () => {
  const user = userEvent.setup()

  beforeEach(() => {
    mockCreateSubmissionFn.mockClear()
  })

  it("displays validation messages for empty submission", async () => {
    customRender(<DataForm />)
    await user.click(screen.getByRole("button", { name: /submit/i }))
  
    expect(await screen.findByText(/name is required/i)).toBeInTheDocument()
    expect(await screen.findByText(/invalid email format/i)).toBeInTheDocument()
    expect(await screen.findByText(/age is required/i)).toBeInTheDocument()
  })

  it("handles basic form submission", async () => {
    const formData = {
      name: "Test User",
      email: "test@example.com",
      age: 25,
    }
  
    customRender(<DataForm />)
    
    // Fill form with explicit data
    const nameInput = screen.getByPlaceholderText(/enter name/i) as HTMLInputElement
    const emailInput = screen.getByPlaceholderText(/enter email/i) as HTMLInputElement
    const ageInput = screen.getByTestId('number-input') as HTMLInputElement
  
    await user.type(nameInput, formData.name)
    await user.type(emailInput, formData.email)
    await user.clear(ageInput)
    await user.type(ageInput, formData.age.toString())
  
    // Log form values
    console.log('Form values:', {
      name: nameInput.value,
      email: emailInput.value,
      age: ageInput.value
    })
  
    await user.click(screen.getByRole("button", { name: /submit/i }))
  
    // Log mock calls
    await new Promise(resolve => setTimeout(resolve, 100))
    console.log('Mock calls:', mockCreateSubmissionFn.mock.calls)
  })
})
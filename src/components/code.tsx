const react: string[] = [
  `const MyComponent = () => <div>Hello World!</div>;`,
  `const [count, setCount] = useState(0);`,
  `const handleClick = () => setCount(count + 1);`,
  `const [text, setText] = useState("");`,
  `const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setText(e.target.value);`,
  `const [isModalOpen, setIsModalOpen] = useState(false);`,
  `const handleOpenModal = () => setIsModalOpen(true);`,
  `const handleCloseModal = () => setIsModalOpen(false);`,
  `const MyContext = createContext<string>("default");`,
  `const [todos, setTodos] = useState<string[]>([]);`,
  `const handleAddTodo = (todo: string) => setTodos([...todos, todo]);`,
  `const handleRemoveTodo = (index: number) => setTodos(todos.filter((_, i) => i !== index));`,
  `const [isLoading, setIsLoading] = useState(false);`,
  `const fetchData = async () => { setIsLoading(true); const result = await fetch("https://api.example.com/data"); setIsLoading(false); return result; };`,
  `const [selectedOption, setSelectedOption] = useState("option1");`,
  `const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => setSelectedOption(e.target.value);`,
  `const MyComponent = ({ title, children }: { title: string, children: React.ReactNode }) => <div><h2>{title}</h2>{children}</div>;`,
  `const [isVisible, setIsVisible] = useState(false);`,
  `const handleClick = () => setIsVisible(!isVisible);`,
];

const solid: string[] = [
  `const MyComponent = () => <div>Hello World!</div>;`,
  `const [count, setCount] = createSignal(0);`,
  `const handleClick = () => setCount(count() + 1);`,
  `const [text, setText] = createSignal("");`,
  `const handleChange = (e: Event) => setText((e.target as HTMLInputElement).value);`,
  `const [isModalOpen, setIsModalOpen] = createSignal(false);`,
];

export { react, solid };

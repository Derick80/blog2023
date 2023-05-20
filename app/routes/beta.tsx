import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import { isAuthenticated } from '~/server/auth/auth.server'
import { json, redirect } from '@remix-run/node'
import { getPosts } from '~/server/post.server'
import { Form, Link, useLoaderData } from '@remix-run/react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { DotsVerticalIcon, ChatBubbleIcon } from '@radix-ui/react-icons'
import { RowBox } from '~/components/boxes'
import FavoriteContainer from '~/components/favorite-container'
import LikeContainer from '~/components/like-container'
import { ShareButton } from '~/components/share-button'
import CommentContainer from '~/components/blog-ui/comments/comment-list'
import React, { FC } from 'react'
import Button from '~/components/button'
import CommentBox from '~/components/blog-ui/comments/comment-box'


const options = [
  { id: '1', value: '1', label: '1' },
  { id: '2', value: '2', label: '2' },
  { id: '3', value: '3', label: '3' },
  { id: '4', value: '4', label: '4' },
  { id: '5', value: '5', label: '5' },
  { id: '6', value: '6', label: '6' },
  { id: '7', value: '7', label: '7' },
]
export async function action({ request, params }: ActionArgs) {
  const formData = await request.formData()
  const data = Object.fromEntries(formData.entries())

  return json({ data })
}

export async function loader({ request, params }: LoaderArgs) {
  const user = await isAuthenticated(request)
  if (!user) {
    return redirect('/login')
  }

  const posts = await getPosts()
  return json({ posts })
}

export default function BetaRoute() {
  const [selected, setSelected] = React.useState('')
function handleSelectChange(value: string) {
    setSelected(value);

  }

  return(
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-6xl font-bold">
        Hi
      </h1>
      <div className="flex flex-wrap items-center justify-around max-w-4xl mt-6 sm:w-full">

<Select options={options} selectedValue={selected} onChange={
  handleSelectChange
} />

        </div>
        <input type='hidden' name='selected' value={selected} />
    </div>

  )
  
}

interface SelectProps {
  options: Array<{ id:string,value: string; label: string }>;
  selectedValue: string;
  onChange: (value: string) => void;
}

const Select: FC<SelectProps> = ({ options, selectedValue, onChange }) => {
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="inline-block relative w-64">
      <select
        value={selectedValue}
        onChange={handleSelectChange}
        className="block appearance-none w-full bg-white border border-gray-200 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline text-black"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg
          className="fill-current h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M0 6l10 5 10-5-10-5-10 5z" />
        </svg>
      </div>
    </div>
  );
};


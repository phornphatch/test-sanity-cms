import Link from 'next/link'
import {type SanityDocument} from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import type {SanityImageSource} from '@sanity/image-url/lib/types/types'

import {client} from '../sanity/client'

const POSTS_QUERY = `*[
  _type == "post"
  && defined(slug.current)
]|order(publishedAt desc)[0...12]{_id, title, slug, publishedAt}`

const BANNERS_QUERY = `*[_type == "banner"]{ _id, title, image }`

const {projectId, dataset} = client.config()
const urlFor = (source: SanityImageSource) =>
  projectId && dataset ? imageUrlBuilder({projectId, dataset}).image(source) : null

const options = {next: {revalidate: 30}}

export default async function IndexPage() {
  const posts = await client.fetch<SanityDocument[]>(POSTS_QUERY, {}, options)
  const banners = await client.fetch<SanityDocument[]>(BANNERS_QUERY, {}, options)

  return (
    <main className="container mx-auto min-h-screen max-w-3xl p-8">
      <h1 className="text-4xl font-bold mb-8">Sanity API test</h1>
      {banners.map((banner) => {
        const bannerImageUrl = banner.image
          ? urlFor(banner.image)?.width(550).height(310).url()
          : null
        return (
          <div key={banner._id}>
            <h2 className="py-4">{banner.title}</h2>
            {bannerImageUrl && (
              <img
                src={bannerImageUrl}
                alt={banner.title}
                className="aspect-video rounded-xl"
                width="550"
                height="310"
              />
            )}
          </div>
        )
      })}
      <h2 className="text-3xl font-bold mb-4 pt-8">Posts</h2>
      <ul className="flex flex-col gap-y-4">
        {posts.map((post) => (
          <li className="hover:underline" key={post._id}>
            <Link href={`/${post.slug.current}`}>
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p>{new Date(post.publishedAt).toLocaleDateString()}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}

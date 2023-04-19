import { useFetcher, useSubmit } from "@remix-run/react";
import React from "react";
import Button from "../button";

export default function ImageUploader({ setUrl }: any) {
  const fetcher = useFetcher();

  const onClick = async () =>
    fetcher.submit({
      imageUrl: "imageUrl",
      key: "imageUrl",
      action: "/actions/cloudinary",
    });
  return (
    <>
      <fetcher.Form
        method="POST"
        encType="multipart/form-data"
        action="/actions/cloudinary"
        onChange={onClick}
        className="flex flex-row gap-2 items-center"
      >
        <label htmlFor="imageUrl" className="subtitle"></label>
        <input
          id="imageUrl"
          className="block w-full rounded-xl border-2 p-2 text-sm text-slate12"
          type="file"
          name="imageUrl"
          accept="image/*"
        />
        <Button variant="primary" className="" type="submit">
          Upload
        </Button>
      </fetcher.Form>
      {fetcher.data ? (
        <div className="flex mx-auto flex-row w-12 h-fit items-center ">
          <input
            type="hidden"
            name="imageUrl"
            onChange={setUrl(fetcher?.data.imageUrl)}
          />
          <img
            src={fetcher?.data?.imageUrl}
            alt={"no"}
            className="w-full h-full object-cover"
          />
        </div>
      ) : null}
    </>
  );
}

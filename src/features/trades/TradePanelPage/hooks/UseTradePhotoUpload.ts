import { TradeService } from "@/shared/api/services/TradeService"
import { extractErrorMessage } from "@/shared/utilities/errorHandlers"
import { useCallback, useState } from "react"

type Args = {
  tradeId: number | null
  onUpload: () => void | Promise<void>
}

type Side = "buyer" | "seller"

const useTradePhotoUpload = ({ tradeId, onUpload }: Args) => {
  const [buyerFiles, setBuyerFiles] = useState<File[]>([])
  const [sellerFiles, setSellerFiles] = useState<File[]>([])
  const [uploadTradeSide, setUploadTradeSide] = useState<Side | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const uploadFiles = useCallback(
    async (side: Side, files: File[], clearFiles: () => void) => {
      if (!tradeId || !files.length) {
        return
      }

      setUploadTradeSide(side)
      setUploadError(null)

      try {
        for (const file of files) {
          const res = await TradeService.uploadTradePhoto(
            tradeId,
            file,
            side === "buyer"
          )

          if (!res.isSuccess) {
            setUploadError(res.message ?? "Nie udało się wysłać zdjęcia")
            return
          }
        }

        clearFiles()
        await onUpload()
      } catch (e) {
        setUploadError(extractErrorMessage(e, "Nie udało się wysłać zdjęcia"))
      } finally {
        setUploadTradeSide(null)
      }
    },
    [tradeId, onUpload]
  )

  const uploadBuyer = useCallback(() => {
    return uploadFiles("buyer", buyerFiles, () => setBuyerFiles([]))
  }, [uploadFiles, buyerFiles])

  const uploadSeller = useCallback(() => {
    return uploadFiles("seller", sellerFiles, () => setSellerFiles([]))
  }, [uploadFiles, sellerFiles])

  const resetPhotos = useCallback(() => {
    setBuyerFiles([])
    setSellerFiles([])
    setUploadTradeSide(null)
    setUploadError(null)
  }, [])

  return {
    buyerFiles,
    setBuyerFiles,
    sellerFiles,
    setSellerFiles,
    uploadTradeSide,
    uploadError,
    uploadBuyer,
    uploadSeller,
    resetPhotos,
  }
}

export default useTradePhotoUpload

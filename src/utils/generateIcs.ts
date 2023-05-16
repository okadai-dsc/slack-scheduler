import * as ics from 'ics';
import { DateTime } from 'luxon';

/**
 * icsフォーマット文字列を生成する関数
 *
 * @param startDateTime 予定の開始時刻
 * @param duration 予定の開催期間(分)
 * @param title タイトル
 * @param description 詳細
 * @param location 場所
 * @param url URL
 * @returns icsフォーマット文字列のPromise
 */
export const generateIcs = async (
  startDateTime: number,
  duration: number,
  title: string,
  description: string,
  location?: string,
  url?: string,
): Promise<string> => {
  const date = DateTime.fromSeconds(startDateTime);
  const localdate = date.setZone('Asia/Tokyo');
  const event: ics.EventAttributes = {
    start: [
      Number(localdate.year),
      Number(localdate.month),
      Number(localdate.day),
      Number(localdate.hour),
      Number(localdate.minute),
    ] as [number, number, number, number, number],
    duration: { hours: Math.floor(duration / 60), minutes: duration % 60 },
    title: title,
    description: description,
    location: location,
    geo: location?.includes('部室')
      ? { lat: 34.68955188933618, lon: 133.92321336645284 }
      : undefined,
    url: url,
  };

  return new Promise<string>((resolve, reject) => {
    ics.createEvent(event, (error, value) => {
      if (error) reject(error);
      resolve(value);
    });
  });
};

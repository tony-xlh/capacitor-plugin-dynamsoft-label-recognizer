package com.dynamsoft.capacitor.dlr;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Point;
import android.util.Base64;

import com.dynamsoft.core.Quadrilateral;
import com.dynamsoft.dlr.DLRCharacterResult;
import com.dynamsoft.dlr.DLRLineResult;
import com.dynamsoft.dlr.DLRResult;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;

import java.io.ByteArrayOutputStream;

public class Utils {

    public static Bitmap base642Bitmap(String base64) {
        byte[] decode = Base64.decode(base64,Base64.DEFAULT);
        return BitmapFactory.decodeByteArray(decode,0,decode.length);
    }

    public static String bitmap2Base64(Bitmap bitmap) {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        bitmap.compress(Bitmap.CompressFormat.JPEG, 100, outputStream);
        return Base64.encodeToString(outputStream.toByteArray(), Base64.DEFAULT);
    }

    public static JSObject getMapFromDLRResult(DLRResult result){
        JSObject map = new JSObject();
        map.put("referenceRegionName",result.referenceRegionName);
        map.put("textAreaName",result.textAreaName);
        map.put("confidence",result.confidence);
        map.put("pageNumber",result.pageNumber);
        JSArray lineResults = new JSArray();
        for (DLRLineResult lineResult:result.lineResults) {
            lineResults.put(getMapFromDLRLineResult(lineResult));
        }
        map.put("lineResults",lineResults);
        map.put("location",getMapFromLocation(result.location));
        return map;
    }

    private static JSObject getMapFromDLRLineResult(DLRLineResult result){
        JSObject map = new JSObject();
        map.put("lineSpecificationName",result.lineSpecificationName);
        map.put("text",result.text);
        map.put("characterModelName",result.characterModelName);
        map.put("location",getMapFromLocation(result.location));
        map.put("confidence",result.confidence);
        JSArray characterResults = new JSArray();
        for (DLRCharacterResult characterResult:result.characterResults) {
            characterResults.put(getMapFromDLRCharacterResult(characterResult));
        }
        map.put("characterResults",characterResults);
        return map;
    }

    private static JSObject getMapFromDLRCharacterResult(DLRCharacterResult result){
        JSObject map = new JSObject();
        map.put("characterH",String.valueOf(result.characterH));
        map.put("characterM",String.valueOf(result.characterM));
        map.put("characterL",String.valueOf(result.characterL));
        map.put("characterHConfidence",result.characterHConfidence);
        map.put("characterMConfidence",result.characterMConfidence);
        map.put("characterLConfidence",result.characterLConfidence);
        map.put("location",getMapFromLocation(result.location));
        return map;
    }

    private static JSObject getMapFromLocation(Quadrilateral location){
        JSObject map = new JSObject();
        JSArray points = new JSArray();
        for (Point point: location.points) {
            JSObject pointAsMap = new JSObject();
            pointAsMap.put("x",point.x);
            pointAsMap.put("y",point.y);
            points.put(pointAsMap);
        }
        map.put("points",points);
        return map;
    }
}